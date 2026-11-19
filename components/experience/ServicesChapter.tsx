import Link from "next/link";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import CodeRounded from "@mui/icons-material/CodeRounded";
import WebOutlined from "@mui/icons-material/WebOutlined";
import SmartphoneOutlined from "@mui/icons-material/SmartphoneOutlined";
import HubOutlined from "@mui/icons-material/HubOutlined";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import MovieOutlined from "@mui/icons-material/MovieOutlined";
import { services } from "@/data/services";
import styles from "./ServicesChapter.styles";

const icons = {
  cube: CodeRounded,
  web: WebOutlined,
  phone: SmartphoneOutlined,
  integration: HubOutlined,
  spark: AutoAwesomeOutlined,
  film: MovieOutlined,
};

const featuredServices = services.flatMap(service =>
  service.preview ? [{ ...service, preview: service.preview }] : []
);

export default function ServicesChapter() {
  return <div className={styles.layout}>
    <div className={styles.heading}>
      <h2 id="services-heading">What we do</h2>
      <Link href="/services">All IT services <ArrowForwardRounded /></Link>
    </div>
    <div className={styles.grid}>
      {featuredServices.map((service, index) => {
        const Icon = icons[service.preview.icon];
        return <Link key={service.slug} href={"/services#" + service.slug} className={styles.service}
          data-arrive={index % 3}>
          <Icon className={styles.icon} aria-hidden="true" />
          <div className={styles.title}><h3>{service.name}</h3><ArrowOutwardRounded aria-hidden="true" /></div>
          <p>{service.shortDescription}</p>
        </Link>;
      })}
    </div>
  </div>;
}
