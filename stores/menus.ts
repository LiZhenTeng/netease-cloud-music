import { leftMenus, mainHeaderMenus } from "~/constants/menus-groups";

export const useMenus = defineStore("menus", {
    state: () => ({
        left: leftMenus,
        mainHeader: mainHeaderMenus
    })
})