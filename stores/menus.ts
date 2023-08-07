import { leftMenus, mainHeaderMenus } from "~/constants/menus-groups";

export const useMenusStore = defineStore("menus", {
    state: () => ({
        left: leftMenus,
        mainHeader: mainHeaderMenus
    })
})