import { QlooEntity, AffinityLiftItem, TagDivergence, MusicBridgeArtist } from '@/types';

export class AffinityEngine {
  /**
   * Calculates mathematical lift percentage between baseline score and visitor signal score.
   * Formula: Lift % = ((VisitorScore - BaselineScore) / BaselineScore) * 100
   */
  public static calculateLift(baselineScore: number, visitorScore: number): number {
    if (baselineScore <= 0.001) return 0;
    const lift = ((visitorScore - baselineScore) / baselineScore) * 100;
    return Math.round(lift * 10) / 10;
  }

  public static reconcileVenues(
    baselineVenues: QlooEntity[],
    visitorVenues: QlooEntity[]
  ): AffinityLiftItem[] {
    const visitorMap = new Map<string, QlooEntity>();
    visitorVenues.forEach((v) => {
      visitorMap.set(v.name.toLowerCase().trim(), v);
    });

    const reconciled: AffinityLiftItem[] = [];

    baselineVenues.forEach((base) => {
      const match = visitorMap.get(base.name.toLowerCase().trim());
      const visitorScore = match ? match.score : Math.max(0.05, base.score * 0.7);
      const lift = this.calculateLift(base.score, visitorScore);

      let status: AffinityLiftItem['status'] = 'neutral';
      if (lift >= 50) status = 'surging';
      else if (lift > 10) status = 'over_indexing';
      else if (lift < -15) status = 'under_indexing';

      reconciled.push({
        id: base.id,
        urn: base.urn,
        name: base.name,
        category: 'place',
        baselineScore: Math.round(base.score * 100) / 100,
        visitorScore: Math.round(visitorScore * 100) / 100,
        liftPercentage: lift,
        status,
        tags: base.tags,
        significanceReason: match?.metadata?.description || `Score shifted from ${base.score} to ${visitorScore} with visitor cohort signal active.`,
      });
    });

    // Sort by lift descending
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

  public static reconcileMusicBridge(artists: QlooEntity[]): MusicBridgeArtist[] {
    return artists.map((art) => {
      const harmonicOverlap = Math.round(art.score * 100) / 100;
      return {
        urn: art.urn,
        name: art.name,
        subgenre: art.metadata?.subgenre || art.tags[0] || 'Contemporary Cross-Genre',
        originAffinity: Math.min(0.98, Math.round((harmonicOverlap + 0.08) * 100) / 100),
        destinationAffinity: Math.max(0.65, Math.round((harmonicOverlap - 0.05) * 100) / 100),
        harmonicOverlapScore: harmonicOverlap,
        recommendedTimeSlot: harmonicOverlap > 0.85 ? '18:00 - 21:00 (Prime Aperitivo)' : '14:00 - 17:00 (Afternoon Transition)',
        rationale: art.metadata?.description || `High cross-domain co-listening affinity bridge across both regional taste networks.`,
      };
    });
  }
}
