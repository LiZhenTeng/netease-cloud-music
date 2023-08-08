import { APlayer } from "~/types"
export const useAPlayerStore = defineStore('APlayer', {
    state: (): {
        audios: APlayer.Audios
    } => ({
        audios:[]
    })
})