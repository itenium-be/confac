import {Request, Response} from 'express';
import fetch from 'node-fetch';
import config from '../../config';
import {logger} from '../../logger';


type ColumnDef = {
  header: string;
  type: string;
};


export const generateExcel = async (req: Request, res: Response, sheetName: string, columnDef: ColumnDef[], freezeColumns: number) => {
  const excelBody = {
    data: req.body,
    config: {
      fileName: sheetName,
      sheetName,
      freezeColumns,
      columns: columnDef,
    },
  };

  try {
    const response = await fetch(`${config.services.excelCreator}/api/Excel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      body: JSON.stringify(excelBody),
    });

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || JSON.stringify(errorData);
      } catch {
        errorMessage = await response.text();
      }

      logger.error(`Excel service returned ${response.status}: ${errorMessage}`);
      return res.status(response.status).send(errorMessage);
    }

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="result.xlsx"',
    });

    const buffer = await response.arrayBuffer();
    return res.send(Buffer.from(buffer));

  } catch (err: unknown) {
    logger.error(JSON.stringify(err));
    const errorMessage = err instanceof Error ? err.message : String(err);
    if (errorMessage.includes('fetch failed') || errorMessage.includes('NetworkError')) {
      return res.status(503).send('Service unavailable');
    }
    return res.status(500).send('Internal server error');
  }
};
