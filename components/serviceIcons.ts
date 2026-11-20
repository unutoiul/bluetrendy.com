import type { SvgIconComponent } from "@mui/icons-material";
import DevicesOutlined from "@mui/icons-material/DevicesOutlined";
import MovieFilterOutlined from "@mui/icons-material/MovieFilterOutlined";
import SmartToyOutlined from "@mui/icons-material/SmartToyOutlined";
import AccountTreeOutlined from "@mui/icons-material/AccountTreeOutlined";
import InsightsOutlined from "@mui/icons-material/InsightsOutlined";
import CampaignOutlined from "@mui/icons-material/CampaignOutlined";
import ExploreOutlined from "@mui/icons-material/ExploreOutlined";
import type { ServiceIcon } from "@/data/services";

/** One icon for each service, shared by the menus, the home page cards and the service pages. */
export const serviceIcons: Record<ServiceIcon, SvgIconComponent> = {
  build: DevicesOutlined,
  film: MovieFilterOutlined,
  agent: SmartToyOutlined,
  flow: AccountTreeOutlined,
  forecast: InsightsOutlined,
  growth: CampaignOutlined,
  compass: ExploreOutlined,
};
