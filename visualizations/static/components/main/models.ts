/// <reference path="../../references.ts" />
module topic_app {


    export class Section {
        public path:String;
        public title:String;
        public tab_name:String;


    }

    export class Topic{
        public active:boolean;
        public id:number;
        public counts:Array<any>;
        public name:string;
        public description:string;
    }

    export class Document{
        public answers:string;
        public id:number;
        public question:string;
        public title:string;
        public url:string;
    }

    export class TopicDetail{
        public id:number;
        public name:string;
        public description:string;
    }

    export class Post{
        public id:number;
        public title:string;
        public body:string;
    }

}