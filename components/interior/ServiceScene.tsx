import TiltFigure from "./TiltFigure";
import styles from "./Services.styles";

function Bars() {
  return <div className={styles.bars}>{[28, 42, 36, 60, 52, 78, 92].map(height => <i key={height} style={{ height: height + "%" }} />)}</div>;
}

export default function ServiceScene({ slug }: { slug: string }) {
  let scene;
  switch (slug) {
    case "websites-and-ecommerce":
      scene = <div className={styles.shop}>
        <div className={styles.shopHeader}>Field Supply <span>Shop <b>Bag (1)</b></span></div>
        <div className={styles.product}><div className={styles.productPhoto}><i /></div>
          <div><small>Daily goods</small><strong>Field tote</strong><div className={styles.swatches}><i/><i/><i/></div><em>Add to bag</em></div>
        </div>
      </div>;
      break;
    case "mobile-cross-platform":
      scene = <div className={styles.phone}><div className={styles.island}/>
        <strong>Site visit</strong><div className={styles.map}><i>●</i></div><div className={styles.phoneBottom}><small>Field notes</small><b>Saved offline ✓</b></div>
      </div>;
      break;
    case "it-implementation-and-integration":
      scene = <div className={styles.network}><strong>CRM</strong><i/><b>API</b><i/><strong>Finance</strong></div>;
      break;
    case "complex-mission-critical-systems":
      scene = <div className={styles.monitor}><small>System health</small><div className={styles.trace}/><strong>● &nbsp; Operational</strong></div>;
      break;
    case "legacy-modernization":
      scene = <div className={styles.migration}><div><small>Current release</small><strong>Legacy runtime</strong></div><span>↓</span><div><small>Next release</small><strong>Cloud deployment</strong></div></div>;
      break;
    case "ai-automation-applied-ml":
      scene = <div className={styles.extraction}><div className={styles.document}><small>Invoice</small><i/><i/><i/></div>
        <div className={styles.result}><small>Extracted fields</small><b>✓ &nbsp; Supplier</b><b>✓ &nbsp; Total</b></div></div>;
      break;
    case "marketing-video-production":
      scene = <div className={styles.edit}><div className={styles.frame}><span>▶</span></div><div className={styles.tracks}><i/><i/><i/></div><small>00:00:07 <span>/ 00:00:15</span></small></div>;
      break;
    default:
      scene = <div className={styles.dashboard}><small>Operations</small><strong>Weekly activity</strong><Bars/><div className={styles.chartFooter}>Mon <span>Sun</span></div></div>;
  }
  return <TiltFigure>{scene}</TiltFigure>;
}

