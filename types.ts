export namespace Layout {
    export namespace Left {
        export type MenuGroups = Array<Group>
        type Group = {
            key: string
            title: string
            menus: Array<Menu>
        }
        type Menu = {
            name: string,
            alias: string
            key: string,
            url: string,
            icon: Component
        }
    }
    export namespace MainHeader {
        export type MenuGroups = Array<Group>
        type Group = {
            name: string,
            key: string,
            url: string,
            new: boolean
        }
    }
}