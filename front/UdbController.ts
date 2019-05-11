import {Logger} from "../Logger";
import {UdbService} from "./UdbService";

export class UdbController {

  private matchCriteria: string;
  private matchResults = [];
  private logs = 'Loading...';

  /*@ngInject*/
  constructor($scope, private udbService: UdbService, logger: Logger) {
    this.matchCriteria = '';
    logger.onLog(msg => {
      $scope.$applyAsync(() => {
        console.log(msg);
        msg = msg.replace(/\n/g, '<br/>');
        this.logs = msg;
      });
    });
    $scope.$applyAsync(() => {
      udbService.load('./usources.txt', './U.RND');
    });
  }

  $onInit = () => {
  };  // Workarounds tsc weak type error about not implementing IController

  timeLink(year) {
    const millennium = Math.floor(year / 1000);
    const centuries = year % 1000;
    const century = Math.floor(centuries / 100);
    const decades = centuries % 100;
    const decade = Math.floor(decades / 10);
    const y = decades % 10;
    return `/time/${millennium}/${century}/${decade}/${y}`;
  }

  async search() {
    let memory = await this.udbService.match(this.matchCriteria);
    this.matchResults = memory.records;
  }
}
