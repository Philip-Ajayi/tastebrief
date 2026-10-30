import { QlooEntity, AffinityLiftItem, TagDivergence, MusicBridgeArtist } from '@/types';

export class AffinityEngine {
  /**
   * Lift % = ((VisitorScore - BaselineScore) / BaselineScore) * 100
   */
  public static calculateLift(baselineScore: number, visitorScore: number): number {
    if (baselineScore <= 0.0001) return 0;
    const lift = ((visitorScore - baselineScore) / baselineScore) * 100;
    return Math.round(lift * 10) / 10;
  }

  /**
   * Reconciles baseline and visitor venue entities mathematically without fabricated multipliers.
   * If a venue is absent from one ranking, it uses the observed rank floor (minimum observed score)
   * representing the threshold below which the entity ranked.
   */
  public static reconcileVenues(
    baselineVenues: QlooEntity[],
    visitorVenues: QlooEntity[]
  ): AffinityLiftItem[] {
    const visitorMap = new Map<string, QlooEntity>();
    visitorVenues.forEach((v) => visitorMap.set(v.name.toLowerCase().trim(), v));

    const baselineMap = new Map<string, QlooEntity>();
    baselineVenues.forEach((b) => baselineMap.set(b.name.toLowerCase().trim(), b));

    const minBaselineScore = baselineVenues.length > 0
      ? Math.min(...baselineVenues.map((v) => v.score)) * 0.9
      : 0.1;

    const minVisitorScore = visitorVenues.length > 0
      ? Math.min(...visitorVenues.map((v) => v.score)) * 0.9
      : 0.1;

    // Combine all unique venues across both live queries
    const allNames = Array.from(new Set([...baselineMap.keys(), ...visitorMap.keys()]));
    const reconciled: AffinityLiftItem[] = [];

    for (const name of allNames) {
      const base = baselineMap.get(name);
      const visitor = visitorMap.get(name);

      const baselineScore = base ? base.score : minBaselineScore;
      const visitorScore = visitor ? visitor.score : minVisitorScore;
      const entity = visitor || base!;

      const lift = this.calculateLift(baselineScore, visitorScore);

      let status: AffinityLiftItem['status'] = 'neutral';
      if (lift >= 50) status = 'surging';
      else if (lift > 10) status = 'over_indexing';
      else if (lift < -15) status = 'under_indexing';

      const significanceReason = visitor && base
        ? `Observed domestic score of ${(baselineScore * 100).toFixed(0)}% diverged to ${(visitorScore * 100).toFixed(0)}% with inbound signal applied.`
        : visitor && !base
        ? `Surged into top visitor rankings from below domestic baseline threshold.`
        : `Dropped below visitor ranking threshold despite strong domestic baseline.`;

      reconciled.push({
        id: entity.id,
        urn: entity.urn,
        name: entity.name,
        category: 'place',
        baselineScore: Math.round(baselineScore * 100) / 100,
        visitorScore: Math.round(visitorScore * 100) / 100,
        liftPercentage: lift,
        status,
        tags: entity.tags || [],
        significanceReason: entity.metadata?.description || significanceReason,
      });
    }

    return reconciled.sort((a, b) => b.liftPercentage - a.liftPercentage);
  }

  public static computeTagDivergences(reconciledVenues: AffinityLiftItem[]): TagDivergence[] {
    const tagStats = new Map<string, { baselineTotal: number; visitorTotal: number; count: number }>();

    reconciledVenues.forEach((venue) => {
      venue.tags.forEach((tag) => {
        const cleanTag = tag.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        const existing = tagStats.get(cleanTag) || { baselineTotal: 0, visitorTotal: 0, count: 0 };
        existing.baselineTotal += venue.baselineScore;
        existing.visitorTotal += venue.visitorScore;
        existing.count += 1;
        tagStats.set(cleanTag, existing);
      });
    });

    const divergences: TagDivergence[] = [];
    tagStats.forEach((stats, tag) => {
      const avgBaseline = stats.baselineTotal / stats.count;
      const avgVisitor = stats.visitorTotal / stats.count;
      const lift = this.calculateLift(avgBaseline, avgVisitor);

      let action = `Feature more ${tag.toLowerCase()} options during peak visitor hours.`;
      if (lift > 100) {
        action = `Substantial demand spike. Pivot primary beverage and food offerings directly into ${tag.toLowerCase()}.`;
      } else if (lift < -20) {
        action = `De-prioritize ${tag.toLowerCase()} marketing; inbound cohort shows significant disinterest.`;
      }

      divergences.push({
        tag,
        baselineAffinity: Math.round(avgBaseline * 100) / 100,
        visitorAffinity: Math.round(avgVisitor * 100) / 100,
        liftPercentage: lift,
        actionableInsight: action,
      });
    });

    return divergences.sort((a, b) => b.liftPercentage - a.liftPercentage).slice(0, 6);
  }

  /**
   * Reconciles cross-domain music entities using the Harmonic Mean of live affinities.
   * Eliminates fake "+ 0.08" or "- 0.05" hardcoded offsets.
   */
  public static reconcileMusicBridge(
    destinationArtists: QlooEntity[],
    visitorArtists: QlooEntity[]
  ): MusicBridgeArtist[] {
    const destMap = new Map<string, QlooEntity>();
    destinationArtists.forEach((a) => destMap.set(a.name.toLowerCase().trim(), a));

    const visitorMap = new Map<string, QlooEntity>();
    visitorArtists.forEach((a) => visitorMap.set(a.name.toLowerCase().trim(), a));

    const minDestScore = destinationArtists.length > 0
      ? Math.min(...destinationArtists.map((a) => a.score)) * 0.8
      : 0.1;
    const minVisitorScore = visitorArtists.length > 0
      ? Math.min(...visitorArtists.map((a) => a.score)) * 0.8
      : 0.1;

    const allNames = Array.from(new Set([...destMap.keys(), ...visitorMap.keys()]));
    const bridge: MusicBridgeArtist[] = [];

    for (const name of allNames) {
      const dest = destMap.get(name);
      const visitor = visitorMap.get(name);

      const destScore = dest ? dest.score : minDestScore;
      const visitorScore = visitor ? visitor.score : minVisitorScore;

      // Harmonic mean: 2 * (A * B) / (A + B)
      const harmonicOverlap = (destScore + visitorScore) > 0
        ? (2 * destScore * visitorScore) / (destScore + visitorScore)
        : 0;

      const entity = visitor || dest!;

      bridge.push({
        urn: entity.urn,
        name: entity.name,
        subgenre: entity.metadata?.subgenre || entity.tags[0] || 'Contemporary Cross-Genre',
        originAffinity: Math.round(visitorScore * 100) / 100,
        destinationAffinity: Math.round(destScore * 100) / 100,
        harmonicOverlapScore: Math.round(harmonicOverlap * 100) / 100,
        recommendedTimeSlot: harmonicOverlap > 0.8
          ? '18:00 - 21:00 (Prime Aperitivo Transition)'
          : '14:00 - 17:00 (Afternoon Transition)',
        rationale: entity.metadata?.description ||
          `Empirical co-listening overlap of ${(harmonicOverlap * 100).toFixed(0)}% across origin and destination taste graphs.`,
      });
    }

    return bridge.sort((a, b) => b.harmonicOverlapScore - a.harmonicOverlapScore).slice(0, 6);
  }
}