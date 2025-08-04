

import  {
    type RouteConfig,
    index,
    route,
    layout,
} from "@react-router/dev/routes"

export default [
    // index("routes/index.tsx"),
    route("", "routes/shop.tsx"),
    // route("shop", "routes/shop.tsx"),

// Nested Routes
//     layout ("routes/dashboard.tsx", [
//         route("finances", "routes/finances. tsx"},
//         route("personal-info", "routes/personal-info.tsx"),
//     1),
] satisfies RouteConfig;