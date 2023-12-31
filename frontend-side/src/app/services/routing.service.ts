import {Injectable} from "@angular/core";
import {Location} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  constructor(private location: Location) {
  }

  clearPathVariable(queryParameters?: string) {
    if(queryParameters) {
      this.location.go('/main' + queryParameters)
    } else {
      this.location.go('/main')
    }
  }

  setPathVariable(pathVariable: string) {
    this.location.go('/main/' + pathVariable)
  }
}
