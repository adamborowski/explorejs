import {DygraphsAdapter, VisJsAdapter} from "explorejs-adapters";
import Dygraph from 'dygraphs';
import $ from "jquery";
const factoryMap = {
  dygraphs(serieCache, dom){
    return new DygraphsAdapter(serieCache, dom, $, Dygraph);
  },
  visjs(sereCache, dom){
    return new VisJsAdapter(sereCache, dom, dataset, groups); //todo visjs adapter should create everthing needed
  },
  flot(serieCace, dom){

  },
  highcharts(serieCace, dom){

  },
  jqplot(serieCace, dom){

  },
  plotly(serieCace, dom){

  }
};
export default (type, serieCache, dom) => factoryMap[type](serieCache, dom);
