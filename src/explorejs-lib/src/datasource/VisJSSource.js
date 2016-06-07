import DataSource from "../modules/DataSource";
export default class VisJSSource {
    constructor(serieCache, someVisJSConfiguration) {
        this.onProjectionRecompile = this.onProjectionRecompile.bind(this);
        this.dataSource = new DataSource(serieCache, this.onProjectionRecompile);
        //todo init vis js configuration
    }

    onProjectionRecompile(diff) {
        // todo touch vis js backing data
        for(var range of diff.removed){
            this.vis.getSerie(range.id).remove(range);
        }
        for(var range of diff.resized){
            this.vis.getSerie(range.id).addMany(range.data);
        }

        for(var range of diff.added){
            this.vis.getSerie(range.id).addMany(range.data);
        }
    }

    initVisInteraction() {
        this.vis.on('changeViewport_foo_bar', ()=> {
            this.dataSource.updateViewState(this.vis.viewport.start, this.vis.viewport.end, this.vis.viewport.displayWidth);
        });
    }
}