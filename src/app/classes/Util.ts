
export class Util {
    private static currentUserId : string = null;

    // Regex pour les adresses mail
    static readonly emailRegex: RegExp = new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z0-9]{2,}$');

    static isUserConnected() : boolean {
        return this.currentUserId != null;
    }

    static get $currentUserId() : string{
        return this.currentUserId;
    }

    static set $currentUserId(newId : string){
        this.currentUserId = newId;
    }
}