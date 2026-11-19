"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ArrowOutwardRounded from "@mui/icons-material/ArrowOutwardRounded";
import { clientLogos, industries, type ClientLogo, type Industry } from "@/data/clients";
import styles from "./TrustStrip.styles";

function ClientMark({ client }: { client: ClientLogo }) {
  const mark = client.file
    ? <span className={styles.mark}><Image src={`/brand/clients/${client.file}`} alt="" fill
        sizes="(max-width: 380px) 42vw, (max-width: 600px) 27vw, 146px" unoptimized /></span>
    : client.name;

  return client.external
    ? <a href={client.href} target="_blank" rel="noopener noreferrer" aria-label={`${client.name} (opens in a new tab)`} title={client.name}>{mark}</a>
    : <Link href={client.href} prefetch={false} aria-label={`${client.name} case study`} title={client.name}>{mark}</Link>;
}

function ClientDirectory({ industry = "", onChange }: {
  industry?: Industry | ""; onChange?: (industry: string) => void;
}) {
  const clients = industry ? clientLogos.filter(client => client.industry === industry) : clientLogos;
  return (
    <>
      <div className={styles.heading}>
        <h2 id="clients-heading">Our clients</h2>
        <label className={styles.filter}>Industry
          <select value={industry} disabled={!onChange} onChange={event => onChange?.(event.target.value)}>
            <option value="">All industries</option>
            {Object.entries(industries).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>
      <ul className={styles.wall} aria-label="Client logos">
        {clients.map(client => <li key={client.name}><ClientMark client={client} /></li>)}
      </ul>
      <div className={styles.foot}>
        <span role="status">{clients.length} {clients.length === 1 ? "client" : "clients"}{industry ? ` in ${industries[industry]}` : ` across ${Object.keys(industries).length} industries`}</span>
        <Link href="/case-studies" prefetch={false}>Read case studies <ArrowOutwardRounded /></Link>
      </div>
    </>
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
