import {Logger} from "../Logger";

export class UdbController {

  private matchCriteria: string;
  private matchResults = [];
  private logs = 'Loading...';

  /*@ngInject*/
  constructor($scope, private udbService, logger: Logger) {
    this.matchCriteria = '';
    logger.subscribe(msg => {
      $scope.$applyAsync(() => {
        console.log(msg);
        msg = msg.replace(/\n/g, '<br/>');
        this.logs = msg;
      });
    });
    $scope.$applyAsync(() => {
      udbService.load('./U.RND');
    });
  }

  search() {
    this.matchResults = this.udbService.match(this.matchCriteria).records;
  }
}