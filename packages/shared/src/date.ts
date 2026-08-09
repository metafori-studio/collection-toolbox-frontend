import { format, isValid, parseISO } from 'date-fns';
import { sk } from 'date-fns/locale';

type DatePrecision = 'day' | 'month' | 'year';

type DatePeriod = {
  precision?: DatePrecision | null
  is_range?: boolean
  start: string | null
  end: string | null
}

const formats = {
  'day': 'd. M. yyyy',
  'month': 'LLLL yyyy',
  'year': 'yyyy',
};

const formatDateSingle = (date: Date, precision: DatePrecision) => {
  const formatStr = formats[precision];
  const output = format(date, formatStr, { locale: sk });
  return output;
};

const formatDatePeriod = (period: DatePeriod | null) => {
  if (!period) {
    return null;
  }
  const {
    precision,
    is_range: isRange,
    start,
    end,
  } = period;

  if (!start || !precision) {
    return null;
  }

  const startParsed = parseISO(start);
  if (!isValid(startParsed)) {
    return null;
  }
  const startFormatted = formatDateSingle(startParsed, precision);

  if (isRange && end) {
    const endParsed = parseISO(end);
    if (!isValid(endParsed)) {
      return null;
    }
    const endFormatted = formatDateSingle(endParsed, precision);
    return `${startFormatted} - ${endFormatted}`;
  } else {
    return startFormatted;
  }
};

export {
  type DatePeriod,
  formatDateSingle,
  formatDatePeriod,
};
