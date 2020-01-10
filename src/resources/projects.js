import Router from 'koa-router';
import moment from 'moment';

export const findActiveProjectsBySelectedDate = (selectedDate, projects) => {
  return projects.filter(project => {
    if (project.endDate) {
      const isStartDateInSameMonthOrBefore = moment(project.startDate).isSameOrBefore(selectedDate, 'months')
      const isEndDateInSameMonthOrAfter = moment(project.endDate).isSameOrAfter(selectedDate, 'months')
      return isStartDateInSameMonthOrBefore && isEndDateInSameMonthOrAfter
    }

    return moment(project.startDate).isSameOrBefore(selectedDate, 'months')
  })
}

export default function register(app) {
  const router = new Router({
    prefix: '/api/projects'
  });

  router.get('/', function* () {
    this.body = yield this.mongo.collection('projects').find().toArray();
  })

  router.post('/', function* () {
    const newProject = { ...this.request.body, createdOn: new Date().toISOString() };

    const inserted = yield this.mongo.collection('projects').insert(newProject);

    const insertedId = inserted.insertedIds[1];
    this.body = Object.assign(newProject, insertedId.toString().toObjectId());
  });

  router.get('/month', function* () {
    this.body = yield this.mongo.collection('projects_month').find().toArray();
  })

  router.post('/month', function* () {
    const { body } = this.request

    if (!body.month) {
      this.status = 400
      this.body = { msg: 'No month was provided' }
      return
    }

    const projects = yield this.mongo.collection('projects').find().toArray()

    const matchedProjects = findActiveProjectsBySelectedDate(body.month, projects)

    const result = []

    for (let i = 0; i < matchedProjects.length; i++) {
      const projectMonth = { month: body.month, projectId: matchedProjects[i]._id }
      const inserted = yield this.mongo.collection('projects_month').insert(projectMonth)
      const insertedId = inserted.insertedIds[1]
      result.push({ ...projectMonth, ...insertedId.toString().toObjectId() })
    }
    this.body = result
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
}
