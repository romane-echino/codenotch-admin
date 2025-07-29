import './assets/output.css';
const links = document.head.getElementsByTagName('link');
for (let i = links.length - 1; i >= 0; i--) {
    const link = links[i];
    if (link.rel === 'stylesheet') {
        document.head.removeChild(link);
    }
}

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import weekday from 'dayjs/plugin/weekday'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import 'dayjs/locale/fr'
import 'dayjs/locale/en'
import 'dayjs/locale/de'
import 'dayjs/locale/it'
import 'dayjs/locale/es'

dayjs.extend(localizedFormat)
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(weekday);

export * from './components/KPI/KPI'
export * from './components/Barchart/Barchart'
export * from './components/Application/Application'
export * from './components/Linechart/Linechart'
export * from './components/List/List'
export * from './components/Demographic/Demographic'
export * from './components/Page/Page'
export * from './components/Calendar/Calendar'
export * from './components/Form/Form'
export * from './components/Table/Table'
export * from './components/Radial/Radial'
export * from './components/Box/Box'
export * from './components/Label/Label'
export * from './components/Button/Button'
export * from './components/ToggleButton/ToggleButton'
export * from './components/DateInput/DateInput'
export * from './components/DateRangeInput/DateRangeInput'
export * from './components/TextInput/TextInput'
export * from './components/ListColumn/ListColumn'
export * from './components/Icon/Icon'
export * from './components/ModalDialog/ModalDialog'
export * from './components/FormStep/FormStep'
export * from './components/Dropdown/Dropdown'
export * from './components/TextArea/TextArea'
export * from './components/SearchInput/SearchInput'
export * from './components/Display/Display'
export * from './components/DisplayField/DisplayField'
export * from './components/Kanban/Kanban'
export * from './components/KanbanCard/KanbanCard'
export * from './components/Tag/Tag'
export * from './components/Inspect/Inspect'
export * from './components/GroupCalendar/GroupCalendar'
export * from './components/ToggleButton/ToggleButton'
export * from './components/ColorInput/ColorInput'
export * from './components/IconInput/IconInput'
export * from './components/FormAddList/FormAddList'
export * from './components/ForEach/ForEach'
export * from './components/HiddenInput/HiddenInput'
export * from './components/VCardButton/VCardButton'
export * from './components/MenuButton/MenuButton'
export * from './components/Image/Image'
export * from './components/Alert/Alert'
export * from './components/ButtonGroup/ButtonGroup'
export * from './components/Tabs/Tabs'
export * from './components/TabItem/TabItem'
export * from './components/RadioButton/RadioButton'
export * from './components/ToggleButton/ToggleButton'
export * from './components/Checkbox/Checkbox'
export * from './components/RadioItem/RadioItem'
export * from './components/Slider/Slider'
export * from './components/CurrencyInput/CurrencyInput'
export * from './components/MailInput/MailInput'
export * from './components/Mock/Mock'
