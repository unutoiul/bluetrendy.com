import type { CSSProperties, ReactNode } from "react";
import AccountBalanceRounded from "@mui/icons-material/AccountBalanceRounded";
import AssignmentRounded from "@mui/icons-material/AssignmentRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";
import ChevronLeftRounded from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import ClosedCaptionRounded from "@mui/icons-material/ClosedCaptionRounded";
import CloudOffRounded from "@mui/icons-material/CloudOffRounded";
import ContactsRounded from "@mui/icons-material/ContactsRounded";
import FactCheckRounded from "@mui/icons-material/FactCheckRounded";
import GroupsRounded from "@mui/icons-material/GroupsRounded";
import InsertChartRounded from "@mui/icons-material/InsertChartRounded";
import LocalShippingRounded from "@mui/icons-material/LocalShippingRounded";
import LockRounded from "@mui/icons-material/LockRounded";
import MapRounded from "@mui/icons-material/MapRounded";
import MenuRounded from "@mui/icons-material/MenuRounded";
import MusicNoteRounded from "@mui/icons-material/MusicNoteRounded";
import PersonRounded from "@mui/icons-material/PersonRounded";
import PhotoCameraRounded from "@mui/icons-material/PhotoCameraRounded";
import PictureAsPdfRounded from "@mui/icons-material/PictureAsPdfRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import SkipNextRounded from "@mui/icons-material/SkipNextRounded";
import SkipPreviousRounded from "@mui/icons-material/SkipPreviousRounded";
import SpaceDashboardRounded from "@mui/icons-material/SpaceDashboardRounded";
import StorageRounded from "@mui/icons-material/StorageRounded";
import SupportAgentRounded from "@mui/icons-material/SupportAgentRounded";
import SyncRounded from "@mui/icons-material/SyncRounded";
import TaskAltRounded from "@mui/icons-material/TaskAltRounded";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";

/*
 * Each service is shown as the thing a client would actually receive: a believable screen
 * with plausible data, drawn in HTML so it stays sharp at any size. Every measure is in em
 * on a 72 × 45 em canvas, and the canvas font size scales with the stage (see the styles).
 */

type Tone = "green" | "blue" | "amber" | "grey";

function Pill({ tone = "grey", dot, children }: { tone?: Tone; dot?: boolean; children: ReactNode }) {
  return <span className="Mock__pill" data-tone={tone} data-dot={dot || undefined}>{children}</span>;
}

function Window({ className, url, title, dark, children }: {
  className: string; url?: string; title?: string; dark?: boolean; children: ReactNode;
}) {
  return <div className={`Mock__window ${className}`} data-dark={dark || undefined}>
    <div className="Mock__chrome">
      <span className="Mock__lights"><i /><i /><i /></span>
      {url
        ? <span className="Mock__url"><LockRounded fontSize="inherit" />{url}</span>
        : <span className="Mock__title">{title}</span>}
    </div>
    <div className="Mock__content">{children}</div>
  </div>;
}

function Phone({ className, children }: { className: string; children: ReactNode }) {
  return <div className={`Mock__phone ${className}`}>
    <div className="Mock__screen">
      <div className="Mock__status">
        <b>9:41</b><span className="Mock__island" />
        <span className="Mock__statusIcons"><span className="Mock__signal"><i /><i /><i /><i /></span><span className="Mock__battery" /></span>
      </div>
      {children}
    </div>
  </div>;
}

/** A polyline through values on a chart `width` wide and `height` tall, highest value `max`. */
function points(values: number[], width: number, height: number, max: number) {
  const step = width / (values.length - 1);
  return values.map((value, index) => `${(index * step).toFixed(1)},${(height - (value / max) * height).toFixed(1)}`);
}

/* Custom software: an operations workspace. */

const thisWeek = [52, 61, 58, 74, 69, 88, 96];
const lastWeek = [47, 50, 57, 55, 63, 66, 71];

function Operations() {
  const line = points(thisWeek, 400, 100, 110);
  const before = points(lastWeek, 400, 100, 110);
  return <>
    <Window className="Mock__ops" url="app.haldenfreight.co.uk/overview">
      <div className="Mock__opsGrid">
        <div className="Mock__side">
          <b className="Mock__brand"><i>H</i>Halden Freight</b>
          <span data-active><SpaceDashboardRounded fontSize="inherit" />Overview</span>
          <span><LocalShippingRounded fontSize="inherit" />Shipments</span>
          <span><TaskAltRounded fontSize="inherit" />Approvals<em>12</em></span>
          <span><GroupsRounded fontSize="inherit" />Customers</span>
          <span><InsertChartRounded fontSize="inherit" />Reports</span>
          <span className="Mock__user"><i className="Mock__avatar">MP</i><span><b>Maya Patel</b><small>Operations lead</small></span></span>
        </div>
        <div className="Mock__main">
          <div className="Mock__mainHead">
            <b>Overview</b>
            <span className="Mock__search"><SearchRounded fontSize="inherit" />Search shipments</span>
            <span className="Mock__select">Last 7 days</span>
          </div>
          <div className="Mock__kpis">
            <div><small>Shipments in progress</small><strong>248</strong><Pill tone="green">+12% on last week</Pill></div>
            <div><small>Average turnaround</small><strong>1.8 days</strong><Pill tone="green">0.4 days faster</Pill></div>
            <div><small>Approvals waiting</small><strong>12</strong><Pill tone="amber">3 overdue</Pill></div>
          </div>
          <div className="Mock__panel Mock__chart">
            <div className="Mock__panelHead"><b>Shipments per day</b>
              <span className="Mock__legend"><i />This week<i data-muted />Last week</span></div>
            <svg viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs><linearGradient id="mock-ops-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2f7de1" stopOpacity=".22" /><stop offset="1" stopColor="#2f7de1" stopOpacity="0" />
              </linearGradient></defs>
              {[25, 50, 75].map(y => <line key={y} x1="0" x2="400" y1={y} y2={y} className="Mock__grid" />)}
              <path d={`M0,100 L${line.join(" L")} L400,100 Z`} fill="url(#mock-ops-fill)" className="Mock__area" />
              <polyline points={before.join(" ")} className="Mock__before" />
              <polyline points={line.join(" ")} className="Mock__line" pathLength={1} />
            </svg>
            <div className="Mock__axis">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => <span key={day}>{day}</span>)}</div>
          </div>
          <div className="Mock__panel Mock__table">
            <div data-head><span>Shipment</span><span>Customer</span><span>Route</span><span>Status</span><span>Owner</span></div>
            <div><span>SHP-20418</span><span>Northwind Ltd</span><span>Leeds to Bristol</span><span><Pill tone="green" dot>Delivered</Pill></span><span><i className="Mock__avatar">JL</i></span></div>
            <div><span>SHP-20417</span><span>Arden Foods</span><span>Hull to Leicester</span><span><Pill tone="blue" dot>In transit</Pill></span><span><i className="Mock__avatar" data-alt>AK</i></span></div>
            <div><span>SHP-20415</span><span>Kestrel Retail</span><span>Leeds to York</span><span><Pill tone="amber" dot>Needs approval</Pill></span><span><i className="Mock__avatar">MP</i></span></div>
          </div>
        </div>
      </div>
    </Window>
    <div className="Mock__toast Mock__opsToast">
      <CheckCircleRounded fontSize="inherit" />
      <span><b>Approval recorded</b><small>SHP-20415 approved by Maya Patel</small></span>
      <time>Just now</time>
    </div>
  </>;
}

/* Websites & e-commerce: a booking site on desktop and the confirmation on a phone. */

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// December 2026 starts on a Tuesday.
const december = [null, ...Array.from({ length: 31 }, (_, index) => index + 1)];

function Booking() {
  return <>
    <Window className="Mock__booking" url="harbourphysio.co.uk/book">
      <div className="Mock__siteHead">
        <b className="Mock__siteLogo"><i />Harbour Physio</b>
        <span>Treatments</span><span>Clinicians</span><span>Prices</span>
        <span className="Mock__siteButton">Book now</span>
      </div>
      <div className="Mock__bookGrid">
        <div className="Mock__bookIntro">
          <h4>Book an appointment</h4>
          <p>Sports injuries, back pain and rehab after surgery, in central Bristol.</p>
          <div className="Mock__options">
            <span data-selected><i /><span><b>Initial assessment</b><small>45 minutes</small></span><em>£65</em></span>
            <span><i /><span><b>Follow-up session</b><small>30 minutes</small></span><em>£48</em></span>
            <span><i /><span><b>Sports massage</b><small>60 minutes</small></span><em>£55</em></span>
          </div>
        </div>
        <div className="Mock__calendar">
          <div className="Mock__calHead"><b>December 2026</b><span><ChevronLeftRounded fontSize="inherit" /><ChevronRightRounded fontSize="inherit" /></span></div>
          <div className="Mock__calGrid">
            {weekdays.map(day => <small key={day}>{day.slice(0, 2)}</small>)}
            {december.map((day, index) => {
              const weekend = index % 7 >= 5;
              const state = day === 9 ? "selected" : !day || day < 7 || weekend ? "off" : undefined;
              return <span key={index} data-state={state}>{day}</span>;
            })}
          </div>
          <div className="Mock__slots"><span>09:00</span><span data-selected>10:30</span><span>13:15</span><span>16:45</span></div>
          <span className="Mock__button">Continue to your details</span>
        </div>
      </div>
    </Window>
    <div className="Mock__card Mock__bookStats">
      <small>Online bookings this week</small>
      <span><strong>126</strong><Pill tone="green">+18%</Pill></span>
      <svg viewBox="0 0 120 30" preserveAspectRatio="none"><polyline points="0,24 20,22 40,25 60,16 80,18 100,9 120,5" /></svg>
    </div>
    <Phone className="Mock__bookPhone">
      <div className="Mock__phoneBar"><b className="Mock__siteLogo"><i />Harbour Physio</b><MenuRounded fontSize="inherit" /></div>
      <div className="Mock__confirm">
        <CheckCircleRounded fontSize="inherit" />
        <b>You’re booked</b>
        <small>We’ve emailed your confirmation.</small>
      </div>
      <dl className="Mock__receipt">
        <div><dt>Treatment</dt><dd>Initial assessment</dd></div>
        <div><dt>When</dt><dd>Wed 9 Dec, 10:30</dd></div>
        <div><dt>Clinician</dt><dd>Sam Okafor</dd></div>
        <div><dt>Paid</dt><dd>£65.00</dd></div>
      </dl>
      <span className="Mock__button">Add to calendar</span>
      <span className="Mock__textButton">Change or cancel</span>
    </Phone>
  </>;
}

/* Mobile apps: a field inspection app that keeps working without signal. */

function Field() {
  return <>
    <Phone className="Mock__listPhone">
      <div className="Mock__appHead"><b>Reports</b><small>Today, 4 visits</small></div>
      <div className="Mock__reports">
        <span><i data-photo="1" /><span><b>Boiler room</b><small>Unit 4</small></span><Pill tone="amber">Waiting</Pill></span>
        <span><i data-photo="2" /><span><b>Fire panel</b><small>Gate 2</small></span><Pill tone="green">Synced</Pill></span>
        <span><i data-photo="3" /><span><b>Loading bay lights</b><small>Dock 1</small></span><Pill tone="green">Synced</Pill></span>
        <span><i data-photo="4" /><span><b>Roof access</b><small>Block C</small></span><Pill tone="green">Synced</Pill></span>
      </div>
      <div className="Mock__tabbar">
        <span data-active><AssignmentRounded fontSize="inherit" />Reports</span>
        <span><MapRounded fontSize="inherit" />Map</span>
        <span><PersonRounded fontSize="inherit" />Profile</span>
      </div>
    </Phone>
    <Phone className="Mock__fieldPhone">
      <div className="Mock__map">
        <svg viewBox="0 0 200 230" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="230" fill="#ede7dc" />
          <path d="M-10 170 C40 150 70 190 120 172 S190 140 215 150 L215 200 C170 190 140 222 100 214 S30 200 -10 214 Z" fill="#b9dcf2" />
          <path d="M120 20 h70 v60 h-60 Z" fill="#cfe5c2" />
          <g fill="#e2dacb">
            <rect x="14" y="22" width="40" height="30" rx="2" /><rect x="62" y="22" width="44" height="30" rx="2" />
            <rect x="14" y="64" width="40" height="38" rx="2" /><rect x="62" y="64" width="26" height="38" rx="2" />
            <rect x="126" y="96" width="60" height="40" rx="2" /><rect x="14" y="114" width="74" height="26" rx="2" />
          </g>
          <g stroke="#d6cdbd" strokeWidth="9" fill="none"><path d="M0 58 H200" /><path d="M58 0 V160" /><path d="M110 0 V150 L200 88" /><path d="M0 108 H110" /></g>
          <g stroke="#fff" strokeWidth="6.5" fill="none"><path d="M0 58 H200" /><path d="M58 0 V160" /><path d="M110 0 V150 L200 88" /><path d="M0 108 H110" /></g>
          <path d="M58 160 V108 H110 V128" stroke="#2f7de1" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="58" cy="160" r="9" className="Mock__ping" />
          <circle cx="58" cy="160" r="5" fill="#fff" stroke="#2f7de1" strokeWidth="3" />
        </svg>
        <span className="Mock__mapSearch"><SearchRounded fontSize="inherit" />Riverside Works, Unit 4</span>
        <span className="Mock__pin"><i /></span>
      </div>
      <div className="Mock__sheet">
        <i className="Mock__handle" />
        <b>Boiler room inspection</b>
        <small>Unit 4, due today</small>
        <Pill tone="amber"><CloudOffRounded fontSize="inherit" />No signal. Saved on this phone</Pill>
        <div className="Mock__checks">
          <span data-done><CheckCircleRounded fontSize="inherit" />Pressure within range</span>
          <span data-done><CheckCircleRounded fontSize="inherit" />Ventilation clear</span>
          <span><PhotoCameraRounded fontSize="inherit" />Photo of valve tag</span>
        </div>
        <span className="Mock__button">Submit report</span>
      </div>
    </Phone>
    <div className="Mock__notice">
      <span className="Mock__appIcon"><FactCheckRounded fontSize="inherit" /></span>
      <span><b>FieldCheck</b><small>3 reports synced when you got signal back.</small></span>
      <time>now</time>
    </div>
    <div className="Mock__card Mock__pdf">
      <PictureAsPdfRounded fontSize="inherit" />
      <span><b>Boiler room inspection.pdf</b><small>Sent to the facilities team with 2 photos</small></span>
    </div>
  </>;
}

/* IT setup & integration: systems connected through one sync service. */

function Integration() {
  return <>
    <Window className="Mock__hub" title="Integration hub">
      <svg className="Mock__wires" viewBox="0 0 660 246" preserveAspectRatio="none" aria-hidden="true">
        {["M180,56 C230,56 230,110 270,110", "M180,171 C230,171 230,132 270,132",
          "M390,110 C430,110 430,56 480,56", "M390,132 C430,132 430,171 480,171"].map(d => <g key={d}>
          <path d={d} className="Mock__wire" /><path d={d} className="Mock__flow" />
        </g>)}
      </svg>
      <div className="Mock__node" data-at="crm"><i data-hue="blue"><ContactsRounded fontSize="inherit" /></i><span><b>Sales CRM</b><small>18,240 customers</small></span></div>
      <div className="Mock__node" data-at="support"><i data-hue="violet"><SupportAgentRounded fontSize="inherit" /></i><span><b>Support desk</b><small>2,310 open tickets</small></span></div>
      <div className="Mock__core">
        <SyncRounded fontSize="inherit" />
        <b>Sync service</b>
        <Pill tone="green" dot>Running</Pill>
        <small>Last run 12:04, every 2 minutes</small>
      </div>
      <div className="Mock__node" data-at="finance"><i data-hue="green"><AccountBalanceRounded fontSize="inherit" /></i><span><b>Finance</b><small>Invoices and payments</small></span></div>
      <div className="Mock__node" data-at="reporting"><i data-hue="amber"><StorageRounded fontSize="inherit" /></i><span><b>Reporting</b><small>Nightly export at 02:00</small></span></div>
    </Window>
    <div className="Mock__card Mock__check">
      <small>Data migration check</small>
      <b>18,240 of 18,240 records match</b>
      <span className="Mock__meter"><i style={{ width: "100%" }} /></span>
      <Pill tone="green"><CheckRounded fontSize="inherit" />0 mismatches</Pill>
    </div>
    <Window className="Mock__log" title="Sync log" dark>
      <div className="Mock__logLines">
        <span><time>12:04:31</time><i data-ok>✓</i>Customer created in Finance<em>Northwind Ltd</em></span>
        <span><time>12:04:32</time><i data-ok>✓</i>Invoice matched to order<em>INV-2041</em></span>
        <span><time>12:04:35</time><i data-warn>!</i>Duplicate contact held for review<em>j.hale@ardenfoods.co.uk</em></span>
        <span><time>12:04:38</time><i data-ok>✓</i>Ticket linked to customer<em>#55102</em></span>
        <span><time>12:04:40</time><i data-ok>✓</i>Records reconciled<em>18,240 of 18,240</em></span>
      </div>
    </Window>
  </>;
}

/* Business-critical systems: a production monitoring console. */

const uptime = Array.from({ length: 90 }, (_, day) => day === 61 ? "amber" : "green");
const latency = [41, 39, 43, 40, 38, 42, 45, 41, 39, 40, 44, 42, 38, 37, 41, 43, 40, 39, 42, 46, 43, 40, 38, 39, 41, 40, 42, 44, 41, 39, 38, 40, 43, 42, 40, 41];

function Monitoring() {
  const line = points(latency, 400, 120, 120);
  return <Window className="Mock__console" title="Trading platform: production" dark>
    <div className="Mock__statusRow">
      <span className="Mock__live"><i /></span>
      <span><b>All systems operational</b><small>Checked 20 seconds ago</small></span>
      <span className="Mock__uptime"><strong>99.99%</strong><small>uptime over 90 days</small></span>
    </div>
    <div className="Mock__strip">{uptime.map((tone, day) => <i key={day} data-tone={tone} />)}</div>
    <div className="Mock__stripScale"><small>90 days ago</small><small>Planned failover test</small><small>Today</small></div>
    <div className="Mock__consoleGrid">
      <div className="Mock__panel">
        <div className="Mock__panelHead"><b>Price update latency, 95th percentile</b><strong>41 ms</strong></div>
        <small className="Mock__limitLabel">Limit 120 ms</small>
        <svg viewBox="0 0 400 120" preserveAspectRatio="none">
          <line x1="0" x2="400" y1="1" y2="1" className="Mock__limit" />
          {[30, 60, 90].map(y => <line key={y} x1="0" x2="400" y1={y} y2={y} className="Mock__grid" />)}
          <polyline points={line.join(" ")} className="Mock__line" pathLength={1} />
        </svg>
        <div className="Mock__axis"><span>11:30</span><span>11:45</span><span>12:00</span><span>Now</span></div>
      </div>
      <div className="Mock__panel Mock__services">
        <span><i />Pricing engine<em>41 ms</em></span>
        <span><i />Market data feed<em>12 ms</em></span>
        <span><i />Risk checks<em>1,204 a minute</em></span>
        <span><i />Audit log<em>All writes confirmed</em></span>
        <span><i />Backup region<em>Ready in Dublin</em></span>
      </div>
    </div>
    <div className="Mock__events">
      <span><time>02:00</time>Failover drill to the Dublin region, switched in 19 seconds<Pill tone="green">Passed</Pill></span>
      <span><time>Yesterday</time>Release 4.12, 312 automated checks, approved by 2 reviewers<Pill tone="blue">Released</Pill></span>
    </div>
  </Window>;
}

/* Upgrades for older software: a staged move with parity checks and a way back. */

function Migration() {
  return <>
    <Window className="Mock__plan" title="Migration plan">
      <div className="Mock__planHead">
        <span><b>Move to the new platform</b><small>Each module moves on its own and can be rolled back.</small></span>
        <Pill tone="blue">Stage 3 of 4</Pill>
      </div>
      <div className="Mock__traffic">
        <span style={{ width: "72%" }}>New platform 72%</span><span>Current system 28%</span>
      </div>
      <div className="Mock__planTable">
        <div data-head><span>Module</span><span>Status</span><span>Checks passed</span></div>
        <div><span>Customer records</span><Pill tone="green" dot>Live</Pill><span className="Mock__progress"><i><b style={{ width: "100%" }} /></i>412 of 412</span></div>
        <div><span>Billing</span><Pill tone="green" dot>Live</Pill><span className="Mock__progress"><i><b style={{ width: "100%" }} /></i>288 of 288</span></div>
        <div data-current><span>Reporting</span><Pill tone="blue" dot>Running side by side</Pill><span className="Mock__progress"><i><b style={{ width: "64%" }} /></i>131 of 204</span></div>
        <div><span>Scheduling</span><Pill dot>Next</Pill><span className="Mock__progress"><i><b style={{ width: "0%" }} /></i>Not started</span></div>
        <div><span>Document archive</span><Pill>Stays on current system</Pill><span className="Mock__progress" data-none>Not needed</span></div>
      </div>
    </Window>
    <Window className="Mock__terminal" title="Terminal" dark>
      <div className="Mock__term">
        <span><i>$</i>npm run parity -- --module=reporting</span>
        <span data-dim>Comparing 204 reports with the current system</span>
        <span data-ok>✓ 131 identical, to the penny</span>
        <span data-dim>… 73 queued for tonight’s run</span>
        <span data-warn>Rollback ready: release 3.2, one command</span>
        <span><i>$</i><b className="Mock__cursor" /></span>
      </div>
    </Window>
  </>;
}

/* AI & automation: invoice fields extracted with their source and a confidence score. */

const fields: { label: string; value: string; score: number; review?: boolean }[] = [
  { label: "Supplier", value: "Kestrel Logistics Ltd", score: 99 },
  { label: "Invoice number", value: "INV-20418", score: 99 },
  { label: "Total due", value: "£4,860.00", score: 98 },
  { label: "VAT", value: "£810.00", score: 97 },
  { label: "Due date", value: "18 Dec 2026", score: 71, review: true },
];

function Extraction() {
  return <Window className="Mock__review" title="Invoice review">
    <div className="Mock__reviewHead">
      <b>Supplier invoices</b><Pill>38 processed today</Pill><Pill tone="amber">2 need a person</Pill>
      <small>Queue: 3 of 40</small>
    </div>
    <div className="Mock__reviewGrid">
      <div className="Mock__viewer">
        <div className="Mock__paper">
          <div className="Mock__paperHead"><b><mark data-step="1">Kestrel Logistics Ltd</mark></b><span>Invoice</span></div>
          <p>14 Canal Wharf, Leeds LS11 5PS<br />VAT GB 284 1937 22</p>
          <div className="Mock__paperMeta">
            <span>Invoice no.<b><mark data-step="2">INV-20418</mark></b></span>
            <span>Date<b>18 Nov 2026</b></span>
            <span>Due<b><mark data-step="5" data-review className="Mock__ink">18 Dec 2026</mark></b></span>
          </div>
          <div className="Mock__paperLines">
            <span data-head><span>Description</span><span>Qty</span><span>Amount</span></span>
            <span><span>Pallet transport, Leeds to Bristol</span><span>12</span><span>£3,720.00</span></span>
            <span><span>Fuel surcharge</span><span>1</span><span>£330.00</span></span>
          </div>
          <div className="Mock__paperTotals">
            <span>Subtotal<b>£4,050.00</b></span>
            <span>VAT 20%<b><mark data-step="4">£810.00</mark></b></span>
            <span data-total>Total due<b><mark data-step="3">£4,860.00</mark></b></span>
          </div>
          <p className="Mock__paperFoot">Payment by bank transfer within 30 days.<br />Sort code 40-11-62, account 7184 2291.</p>
        </div>
      </div>
      <div className="Mock__fields">
        <div className="Mock__fieldsHead"><b>Extracted fields</b><small>Page 1 of 1</small></div>
        {fields.map((field, index) => <div key={field.label} className="Mock__field" data-review={field.review || undefined} style={{ "--step": index } as CSSProperties}>
          <small>{field.label}</small>
          <b>{field.value}</b>
          <span className="Mock__score"><i><b style={{ width: field.score + "%" }} /></i>{field.score}%</span>
          {field.review && <span className="Mock__reviewNote">
            <WarningAmberRounded fontSize="inherit" />Handwritten date. Please confirm.
            <span className="Mock__miniButtons"><em>Edit</em><em data-primary>Confirm</em></span>
          </span>}
        </div>)}
        <div className="Mock__rules">
          <small>Checks</small>
          <span><CheckCircleRounded fontSize="inherit" />Line items add up to the subtotal</span>
          <span><CheckCircleRounded fontSize="inherit" />VAT is 20% of the subtotal</span>
          <span><CheckCircleRounded fontSize="inherit" />Supplier is on the approved list</span>
        </div>
        <div className="Mock__fieldsFoot">
          <span><CheckCircleRounded fontSize="inherit" />Matched to purchase order PO-7713</span>
          <span className="Mock__button">Send to finance</span>
        </div>
      </div>
    </div>
  </Window>;
}

/* Marketing videos: an edit in progress, with exports for each channel. */

function wave(seed: number, count: number) {
  let value = seed;
  return Array.from({ length: count }, () => {
    value = (value * 9301 + 49297) % 233280;
    return 0.25 + (value / 233280) * 0.75;
  });
}
const voice = wave(7, 96);
const music = wave(31, 96);

function Waveform({ values, className }: { values: number[]; className: string }) {
  return <svg className={className} viewBox={`0 0 ${values.length * 4} 20`} preserveAspectRatio="none">
    {values.map((value, index) => <rect key={index} x={index * 4} y={10 - value * 9} width="2.4" height={value * 18} rx="1" />)}
  </svg>;
}

function VideoEdit() {
  return <Window className="Mock__editor" title="Launch film: edit 3" dark>
    <div className="Mock__editTop">
      <div className="Mock__monitor">
        <div className="Mock__frame">
          {/* eslint-disable-next-line @next/next/no-img-element -- a decorative still inside a drawn mock-up */}
          <img src="/brand/blue-ribbon-studio.webp" alt="" loading="lazy" decoding="async" />
          <span className="Mock__safe" />
          <span className="Mock__caption">Filmed in our London studio</span>
        </div>
        <div className="Mock__transport">
          <span><SkipPreviousRounded fontSize="inherit" /><PlayArrowRounded fontSize="inherit" /><SkipNextRounded fontSize="inherit" /></span>
          <time>00:00:07:12 <small>/ 00:00:15:00</small></time>
        </div>
      </div>
      <div className="Mock__inspector">
        <b>Export</b>
        <span data-on><CheckRounded fontSize="inherit" />16:9 for your website and YouTube</span>
        <span data-on><CheckRounded fontSize="inherit" />9:16 for Reels and TikTok</span>
        <span data-on><CheckRounded fontSize="inherit" />1:1 for LinkedIn</span>
        <b>Sound and captions</b>
        <span><ClosedCaptionRounded fontSize="inherit" />English captions, timed</span>
        <span><MusicNoteRounded fontSize="inherit" />Licensed music, mixed for phones</span>
        <span className="Mock__button">Send for approval</span>
      </div>
    </div>
    <div className="Mock__timeline">
      <div className="Mock__ruler">{["00:00", "00:03", "00:06", "00:09", "00:12", "00:15"].map(time => <span key={time}>{time}</span>)}</div>
      <div className="Mock__track"><small>Titles</small><span className="Mock__clips">
        <i data-kind="title" style={{ left: "2%", width: "17%" }}>Opening title</i>
        <i data-kind="title" style={{ left: "44%", width: "21%" }}>Lower third</i>
        <i data-kind="title" style={{ left: "84%", width: "15%" }}>End card</i>
      </span></div>
      <div className="Mock__track"><small>Video</small><span className="Mock__clips">
        <i data-kind="shot" style={{ left: "0%", width: "31%", backgroundPosition: "30% 40%" }} />
        <i data-kind="shot" style={{ left: "31.4%", width: "26%", backgroundPosition: "70% 30%" }} />
        <i data-kind="shot" style={{ left: "57.8%", width: "24%", backgroundPosition: "50% 75%" }} />
        <i data-kind="shot" style={{ left: "82.2%", width: "17.8%", backgroundPosition: "50% 50%" }} />
      </span></div>
      <div className="Mock__track"><small>Voice</small><span className="Mock__clips"><i data-kind="voice" style={{ left: "6%", width: "74%" }}><Waveform values={voice} className="Mock__wave" /></i></span></div>
      <div className="Mock__track"><small>Music</small><span className="Mock__clips"><i data-kind="music" style={{ left: "0%", width: "100%" }}><Waveform values={music} className="Mock__wave" /></i></span></div>
      <span className="Mock__playhead" />
    </div>
  </Window>;
}

const scenes: Record<string, { label: string; Scene: () => ReactNode }> = {
  "ai-native-web-apps": { label: "Example operations workspace: shipment figures, a weekly chart and an approvals table, with a confirmation that an approval was recorded.", Scene: Operations },
  "websites-and-ecommerce": { label: "Example clinic website with a treatment list and booking calendar, a phone showing the booking confirmation, and a weekly bookings figure.", Scene: Booking },
  "mobile-cross-platform": { label: "Example field inspection app on two phones: a map with an offline checklist, a list of reports, and a notice that reports synced.", Scene: Field },
  "it-implementation-and-integration": { label: "Example integration hub connecting a CRM, support desk, finance and reporting through a sync service, with a sync log and a migration check.", Scene: Integration },
  "complex-mission-critical-systems": { label: "Example production monitoring console: 99.99% uptime over 90 days, latency well under its limit, healthy services and a passed failover drill.", Scene: Monitoring },
  "legacy-modernization": { label: "Example migration plan moving modules to a new platform one at a time, with a terminal showing parity checks and a rollback ready.", Scene: Migration },
  "ai-automation-applied-ml": { label: "Example invoice review: fields extracted from a supplier invoice with confidence scores, and a handwritten date flagged for a person to confirm.", Scene: Extraction },
  "marketing-video-production": { label: "Example video edit: a studio shot in the preview, export formats for each channel, and a timeline with titles, footage, voice and music.", Scene: VideoEdit },
};

export function mockupFor(slug: string) {
  return scenes[slug] ?? scenes["ai-native-web-apps"];
}
