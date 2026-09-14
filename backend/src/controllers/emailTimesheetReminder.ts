import {Request, Response} from 'express';
import {sendEmailCore} from './emailInvoices';


export type TimesheetReminderRequest = {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
};


/** Reminds consultants that their timesheet days are still missing */
export const emailTimesheetReminderController = async (
  req: Request<unknown, unknown, TimesheetReminderRequest>,
  res: Response,
) => {
  const email = req.body;
  const to = email.to.split(';').filter(x => !!x);
  if (!to.length) {
    return res.status(400).send({message: 'No recipient'});
  }

  try {
    const info = await sendEmailCore({
      from: '"Itenium Backoffice" <wouter.van.schandevijl@itenium.be>',
      replyTo: to[0],
      to,
      cc: email.cc?.split(';').filter(x => !!x),
      bcc: email.bcc?.split(';').filter(x => !!x),
      subject: email.subject,
      html: email.body,
      attachments: [],
    });

    if (info.rejected?.length) {
      return res.status(400).send(info.response);
    }
  } catch (err) {
    req.logger.error('Timesheet reminder email error', err);
    return res.status(400).send(err);
  }

  return res.status(200).send(new Date().toISOString());
};
