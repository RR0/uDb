import {Logger} from "../Logger";

export class UdbController {

  private matchCriteria: string;
  private matchResults = [];
  private logs = 'Loading...';

  /*@ngInject*/
  constructor($scope, private udbService, logger: Logger) {
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

  timeLink(year) {
    const milenium = Math.floor(year / 1000);
    const centuries = year % 1000;
    const century = Math.floor(centuries / 100);
    const decades = centuries % 100;
    const decade = Math.floor(decades / 10);
    const y = decades % 10;
    return `/time/${milenium}/${century}/${decade}/${y}`;
  }

  search() {
    this.matchResults = this.udbService.match(this.matchCriteria).pages;
  }
}