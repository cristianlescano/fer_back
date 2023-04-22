import morgan from 'morgan';
import moment from 'moment-timezone';

morgan.token('date', (req, res, tz) => {
    return moment().tz(tz).format('YYYY-MM-DD HH:mm:ss');
})
morgan.format('myformat', ':date[America/Argentina/Buenos_Aires] | :method | :status | :url | :response-time ms');

export default morgan('myformat');