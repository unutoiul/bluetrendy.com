"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Tooltip from "@mui/material/Tooltip";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import OpenInNewRounded from "@mui/icons-material/OpenInNewRounded";
import FlagOutlined from "@mui/icons-material/FlagOutlined";
import FactCheckOutlined from "@mui/icons-material/FactCheckOutlined";
import AdminPanelSettingsOutlined from "@mui/icons-material/AdminPanelSettingsOutlined";
import StraightenOutlined from "@mui/icons-material/StraightenOutlined";
import { clientLogos, industries, tileName, type ClientLogo, type Industry } from "@/data/clients";
import Dropdown, { type DropdownOption } from "./Dropdown";
import HeadingMotion from "./motion/HeadingMotion";
import styles from "./TrustStrip.styles";
import { palette, withAlpha } from "@/theme/palette";

const industryOptions = Object.entries(industries).sort(([, a], [, b]) => a.localeCompare(b));
const filterOptions: DropdownOption[] = [
  { value: "", label: "All industries", hint: clientLogos.length, separated: true },
  ...industryOptions.map(([value, label]) => ({
    value, label, hint: clientLogos.filter(client => client.industry === value).length,
  })),
];

// Why work with us, in four commitments. They sit under the logos, where the client list backs them up.
const principles = [
  { title: "Business value first", Icon: FlagOutlined, text: "Every project starts with a problem worth solving." },
  { title: "Build quickly, validate carefully", Icon: FactCheckOutlined, text: "AI speeds up delivery. Experienced engineers review the results." },
  { title: "Your systems, your control", Icon: AdminPanelSettingsOutlined, text: "We connect the tools you approve, with permissions, logging and human approvals." },
  { title: "Measure results", Icon: StraightenOutlined, text: "We track delivery time, operating cost, conversion, forecast error or the KPI that matters to you." },
];

// The card that appears over a logo: who the client is, their industry, and what a click does.
function ClientTip({ client }: { client: ClientLogo }) {
  return (
    <span className={styles.tip}>
      <span className={styles.tipName}>{client.name}</span>
      <span className={styles.tipIndustry}>{industries[client.industry]}</span>
      <span className={styles.tipAction}>
        {client.external
          ? <><OpenInNewRounded aria-hidden="true" />Visit their website <small>Opens in a new tab</small></>
          : <><ArrowForwardRounded aria-hidden="true" />Read the case study</>}
      </span>
    </span>
  );
}

// Each logo is a pre-built tile (scripts/client-tiles.ts): trimmed, size-balanced and on its own white plate,
// so it stays readable even when a phone browser force-darkens the page.
function ClientMark({ client }: { client: ClientLogo }) {
  const mark = <>
    {client.file
      ? <span className={styles.mark}>
          <Image src={`/brand/clients/tiles/${tileName(client.file)}.png`} alt="" fill
            sizes="(max-width: 480px) 45vw, (max-width: 900px) 30vw, 180px" />
        </span>
      : client.name}
    {/* A small badge in the corner says what a click does, before the tooltip has even appeared. */}
    <span className={styles.go} aria-hidden="true">{client.external ? <OpenInNewRounded /> : <ArrowForwardRounded />}</span>
  </>;

  // The link's own label says everything the tooltip shows, so screen readers use that (Tooltip
  // would otherwise point the label at its popup) and the popup itself stays silent.
  const link = client.external
    ? <a href={client.href} target="_blank" rel="noopener noreferrer" aria-labelledby={undefined}
        aria-label={`${client.name}: visit their website (opens in a new tab)`}>{mark}</a>
    : <Link href={client.href} prefetch={false} aria-labelledby={undefined} aria-label={`${client.name}: read the case study`}>{mark}</Link>;

  return (
    <Tooltip title={<ClientTip client={client} />} placement="top" arrow disableInteractive
      enterDelay={150} enterNextDelay={40} leaveDelay={0}
      slotProps={{ popper: { "aria-hidden": true, modifiers: popperModifiers }, tooltip: { sx: tipSx }, arrow: { sx: arrowSx } }}>
      {link}
    </Tooltip>
  );
}

// The sticky header covers the top 78px of the screen: a tooltip that would slip under it opens below the logo instead.
const popperModifiers = [
  { name: "flip", options: { padding: { top: 88, bottom: 8 } } },
  { name: "preventOverflow", options: { padding: 8 } },
];

// Dark glass, like the cards elsewhere on the site, with a lit top edge.
const tipSx = {
  p: "11px 14px 12px",
  maxWidth: 280,
  borderRadius: "12px",
  color: palette.grey[25],
  background: `linear-gradient(160deg, ${palette.navy[675]}, ${palette.navy[800]} 75%)`,
  border: `1px solid ${withAlpha(palette.sky[150], 0.35)}`,
  boxShadow: `inset 0 1px 0 ${withAlpha(palette.sky[175], 0.25)}, 0 18px 40px -16px ${withAlpha(palette.navy[850], 0.75)}, 0 0 24px -8px ${withAlpha(palette.blue[350], 0.45)}`,
  fontFamily: "inherit",
};
const arrowSx = {
  color: palette.navy[800],
  "&::before": { border: `1px solid ${withAlpha(palette.sky[150], 0.35)}` },
};

function ClientDirectory({ industry = "", onChange }: {
  industry?: Industry | ""; onChange?: (industry: string) => void;
}) {
  const clients = industry ? clientLogos.filter(client => client.industry === industry) : clientLogos;
  return (
    <div className={styles.directory}>
      <div className={styles.intro}>
        <HeadingMotion id="clients-heading" text="Our" accent="clients" tone="light" />
        <p>From helping radiologists share scans to building mapping tools for NATO, our work spans {industryOptions.length} industries.</p>
        <Link href="/case-studies" prefetch={false} className={styles.workLink}>
          Read case studies <ArrowForwardRounded fontSize="small" />
        </Link>
      </div>
      <div className={styles.gallery}>
        <div className={styles.toolbar}>
          <span role="status" aria-atomic="true">{clients.length} {clients.length === 1 ? "client" : "clients"}</span>
          <Dropdown aria-label="Filter clients by industry" align="end" options={filterOptions} value={industry}
            disabled={!onChange} onChange={value => onChange?.(value)} />
        </div>
        <ul key={industry} className={styles.wall} aria-label={industry ? `Clients in ${industries[industry]}` : "Client logos"}>
          {clients.map(client => <li key={client.name}><ClientMark client={client} /></li>)}
        </ul>
        <div className={styles.why}>
          <h3>Senior engineering. Practical AI. <span>Real accountability.</span></h3>
          <ul className={styles.principles}>
            {principles.map(({ title, text, Icon }) => (
              <li key={title} data-panel="reveal">
                <Icon aria-hidden="true" />
                <div><h4>{title}</h4><p>{text}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function FilteredClients() {
  const params = useSearchParams();
  const requested = params.get("industry") ?? "";
  const industry = Object.hasOwn(industries, requested) ? requested as Industry : "";

  function choose(value: string) {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("industry", value);
    else url.searchParams.delete("industry");
    url.hash = "clients";
    window.history.pushState(null, "", url);
  }

  return <ClientDirectory industry={industry} onChange={choose} />;
}

export default function TrustStrip() {
  return <Suspense fallback={<ClientDirectory />}><FilteredClients /></Suspense>;
}
