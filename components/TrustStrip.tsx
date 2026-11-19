"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { clientLogos, industries, type ClientLogo, type Industry } from "@/data/clients";
import Dropdown, { type DropdownOption } from "./Dropdown";
import HeadingMotion from "./motion/HeadingMotion";
import styles from "./TrustStrip.styles";

const industryOptions = Object.entries(industries).sort(([, a], [, b]) => a.localeCompare(b));
const filterOptions: DropdownOption[] = [
  { value: "", label: "All industries", hint: clientLogos.length, separated: true },
  ...industryOptions.map(([value, label]) => ({
    value, label, hint: clientLogos.filter(client => client.industry === value).length,
  })),
];

function ClientMark({ client }: { client: ClientLogo }) {
  const mark = <>
    {client.file
      ? <span className={styles.mark} data-logo={client.file}>
          <Image src={`/brand/clients/${client.file}`} alt="" fill sizes="144px" />
        </span>
      : client.name}
    {client.file && <span className={styles.caption} aria-hidden="true">{client.name}</span>}
  </>;

  return client.external
    ? <a href={client.href} target="_blank" rel="noopener noreferrer" aria-label={`${client.name} website (opens in a new tab)`}>{mark}</a>
    : <Link href={client.href} prefetch={false} aria-label={`${client.name} case study`}>{mark}</Link>;
}

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
