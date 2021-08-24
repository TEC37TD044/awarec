/* eslint-disable no-unused-vars */
import Dashboard from "views/Dashboard/Dashboard.js";
import LoginPage from "views/Pages/LoginPage.js";

// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import DesktopMacIcon from "@material-ui/icons/DesktopMac";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import PeopleIcon from "@material-ui/icons/People";
import AssignmentOutlined from "@material-ui/icons/AssignmentOutlined";
import Assets from "views/Assets/Assets";
import NewAsset from "views/Assets/NewAsset";
import UpdateAsset from "views/Assets/UpdateAsset";
import AvailableAssets from "views/Assets/AvailableAssets";
import AssetDetails from "views/Assets/AssetDetails";
import AssignAsset from "views/Assets/AssignAsset";
import AssetRefund from "views/Assets/AssetRefund";
import Users from "views/Users/Users";
import MyAssets from "views/Assets/MyAssets";
import MyAssetDetail from "views/Assets/MyAssetDetail";
import ImportantDevicesIcon from "@material-ui/icons/ImportantDevices";
import AddUser from "views/Users/AddUser";
import UpdateUser from "views/Users/UpdateUser";
import ReportProblem from "views/Assets/ReportProblem";
import MyAssetReports from "views/Assets/MyAssetReports";
import Build from "@material-ui/icons/Build";
import AssetsMaintenanceReports from "views/Assets/AssetsMaintenanceReports";
import MaintenanceReport from "views/Assets/MaintenanceReport";
import AssignAssetToUser from "views/Assets/AssignAssetToUser";

var dashRoutes = [
  {
    path: "/my-assets/:id/report",
    name: "Reportar Problema",
    icon: DesktopMacIcon,
    component: ReportProblem,
    hide: true,
    layout: "/admin",
  },
  {
    path: "/my-assets/:id",
    name: "Características del recurso",
    icon: DesktopMacIcon,
    component: MyAssetDetail,
    hide: true,
    layout: "/admin",
  },
  {
    path: "/my-assets",
    name: "Mis dispositivos",
    icon: ImportantDevicesIcon,
    component: MyAssets,
    mini: "MD",
    layout: "/admin",
    roles: ["admin", "user"],
  },
  {
    path: "/request-asset/:id",
    name: "Reservar Recurso - Detalles",
    icon: EventAvailableIcon,
    component: AssetDetails,
    hide: true,
    layout: "/admin",
  },
  {
    path: "/request-asset",
    name: "Reservar Recurso",
    icon: EventAvailableIcon,
    component: AvailableAssets,
    layout: "/admin",
    roles: ["admin", "user"],
  },
  {
    collapse: true,
    name: "Recursos Electronicos",
    icon: DesktopMacIcon,
    state: "pageCollapse",
    roles: ["admin"],
    views: [
      {
        path: "/assets/:id/assign",
        name: "Asignar recurso a este recurso a un usuario",
        component: AssignAssetToUser,
        hide: true,
        layout: "/admin",
      },
      {
        path: "/reports",
        name: "Reportes de Fallas",
        icon: AssignmentOutlined,
        component: MyAssetReports,
        mini: "RF",
        layout: "/admin",
        roles: ["admin", "user"],
      },
      {
        path: "/assets-maintenance/:id/report",
        name: "Formulario de mantenimiento realizado",
        icon: DesktopMacIcon,
        component: MaintenanceReport,
        hide: true,
        layout: "/admin",
      },
      {
        path: "/assets-maintenance",
        name: "Recursos en Mantenimiento",
        mini: "RM",
        component: AssetsMaintenanceReports,
        roles: ["admin"],
        layout: "/admin",
      },
      {
        path: "/assets/:id",
        name: "Actualizar Recurso",
        icon: EventAvailableIcon,
        component: UpdateAsset,
        hide: true,
        layout: "/admin",
      },
      {
        path: "/assets",
        name: "Recursos Registrados",
        mini: "RR",
        component: Assets,
        roles: ["admin"],
        layout: "/admin",
      },
      {
        path: "/assign-asset",
        name: "Reservas Pendientes",
        mini: "RP",
        component: AssignAsset,
        layout: "/admin",
        roles: ["admin"],
      },
      {
        path: "/assign-refund",
        name: "Registrar Devolución",
        mini: "RD",
        component: AssetRefund,
        layout: "/admin",
        roles: ["admin"],
      },
      {
        path: "/asset-new",
        name: "Nuevo Recurso",
        mini: "NR",
        component: NewAsset,
        roles: ["admin"],
        layout: "/admin",
      },
      {
        path: "/login-page",
        hide: true,
        name: "Login Page",
        mini: "L",
        component: LoginPage,
        layout: "/auth",
      },
    ],
  },
  {
    collapse: true,
    name: "Usuarios",
    icon: PeopleIcon,
    state: "pageCollapse2",
    roles: ["admin"],
    views: [
      {
        path: "/users/:id",
        name: "Actualizar Usuario",
        component: UpdateUser,
        hide: true,
        roles: ["admin"],
        layout: "/admin",
      },
      {
        path: "/users",
        name: "Usuarios Registrados",
        mini: "UR",
        component: Users,
        roles: ["admin"],
        layout: "/admin",
      },
      {
        path: "/user-new",
        name: "Registrar Usuario",
        mini: "RU",
        component: AddUser,
        roles: ["admin"],
        layout: "/admin",
      },
    ],
  },
  {
    path: "/dashboard",
    name: "Reportes",
    icon: DashboardIcon,
    component: Dashboard,
    roles: ["admin"],
    layout: "/admin",
  }
];
export default dashRoutes;
