import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';


@Controller('admin/analytics')
export class AnalyticsController {

  constructor(
    private readonly analyticsService: AnalyticsService,
  ){}

  // Dashboard cards

  @Get('overview')
  getOverview(){

    return this.analyticsService.getOverview();

  }

  // Line chart

  @Get('user-growth')
  getUserGrowth(){

    return this.analyticsService.getUserGrowth();
  }

  @Get('course-enrollment')
getCourseEnrollment(){
  return this.analyticsService.getCourseEnrollment();
}


@Get('top-courses')
getTopCourses() {
  return this.analyticsService.getTopCourses();
}

}