import {Request, Response} from 'express';
import fetch from 'node-fetch';
import config from '../../config';


type ColumnDef = {
  header: string;
  type: string;
};


export const generateExcel = async (req: Request, res: Response, sheetName: string, columnDef: ColumnDef[]) => {
  const excelBody = {
    data: req.body,
    config: {
      fileName: sheetName,
      sheetName,
      columns: columnDef,
    },
  };

  const response = await fetch(`${config.services.excelCreator}/api/Excel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    body: JSON.stringify(excelBody),
  });

  res.set({
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': 'attachment; filename="result.xlsx"',
  });

  const buffer = await response.arrayBuffer();
  return res.send(Buffer.from(buffer));
};
