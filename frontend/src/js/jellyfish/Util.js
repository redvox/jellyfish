export const map_status_color_to_css =
    (status) => {
        switch (status.toLowerCase()) {
            case "ok":
                return "success";
            case "unknown":
                return "default";
            case "warning":
                return "warning";
            case "error":
                return "danger";
            default:
                return "";
        }
    };