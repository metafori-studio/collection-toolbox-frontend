import { format, parseISO } from 'date-fns';
import { sk } from 'date-fns/locale';

type Precision = 'day' | 'month' | 'year';

interface Period {
	precision?: Precision | null
	is_range?: boolean
  start: string | null
  end: string | null
}

const formats = {
  'day': 'd. M. yyyy',
  'month': 'LLLL yyyy',
  'year': 'yyyy',
};

const formatDateSingle = (date: Date, precision: Precision) => {
  const formatStr = formats[precision];
  const output = format(date, formatStr, { locale: sk });
  return output;
};

const formatDatePeriod = (period: Period) => {
  const {
    precision,
    is_range: isRange,
    start,
    end,
  } = period;

  if (!start || !precision) return null;

  const startParsed = parseISO(start);
  const startFormatted = formatDateSingle(startParsed, precision);

  if (isRange && end) {
    const endParsed = parseISO(end);
    const endFormatted = formatDateSingle(endParsed, precision);
    return `${startFormatted} - ${endFormatted}`;
  } else {
    return startFormatted;
  }
};

export {
  formatDateSingle,
  formatDatePeriod,
};
