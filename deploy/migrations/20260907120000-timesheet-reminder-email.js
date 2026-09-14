module.exports = {
  async up(db) {
    await db.collection('config').updateOne({key: 'conf'}, {$set: {
      timesheetReminderTitle: 'Timesheet {{month}}',
      timesheetReminderBody: '<p>Dear,</p>\n<p>We have not yet received your timesheet for {{month}}.<br>Please reply to this email with your signed timesheet and the amount of days worked.</p>\n<p>Thanks!</p>',
    }});
  },

  async down(db) {
    await db.collection('config').updateOne({key: 'conf'}, {$unset: {
      timesheetReminderTitle: '',
      timesheetReminderBody: '',
    }});
  }
};
