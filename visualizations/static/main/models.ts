module topic_app {


    export class Section {
        public path:String;
        public title:String;
        public tab_name:String;


    }

    export class Topic{
        public active:boolean;
        public topic_id:number;
        public counts:Array<any>;
    }

}