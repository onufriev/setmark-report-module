import React, { useState } from 'react'
import { Box, Button, Chip, Grid, IconButton, Paper, SelectInput, Typography } from '..'

const incidents = [
    ['INC-10482', 'Магазин № 184', 'Продажа без проверки КМ', 'RA-01', 'Риск автоштрафа'],
    ['INC-10471', 'Магазин № 052', 'Продажа при запрете кассы', 'RA-01', 'Риск автоштрафа'],
    ['INC-10423', 'Магазин № 317', 'Нарушена последовательность проверки', 'RA-01', 'Риск автоштрафа'],
]

export default { title: 'Set Mark / Screens' }

const ScreenShell = ({ active, children }: { active: string; children: React.ReactNode }) => {
    const [network, setNetwork] = useState('north')
    const networks = [{ label: 'Сеть «Север»', value: 'north' }, { label: 'Сеть «Центр»', value: 'center' }, { label: 'Сеть «Юг»', value: 'south' }]

    return (
    <Box display="flex" flexDirection="column" bgcolor="background.default" minHeight="100vh">
        <Box component="header" height={64} display="flex" alignItems="center" px={2.5} gridGap={18} bgcolor="#0091EA" color="#fff" style={{ boxShadow: '0 2px 6px rgba(0, 75, 135, .24)' }}>
            <Box display="flex" alignItems="center" gridGap={10} minWidth={205}><Box display="grid" style={{ placeItems: 'center', width: 30, height: 30, borderRadius: 4, background: '#fff', color: '#1D2023', fontWeight: 700 }}>S</Box><Typography variant="h6" style={{ color: '#fff' }}>Set Mark</Typography></Box>
            <Box width={180}><SelectInput options={networks} value={network} onSelect={option => setNetwork(option.value)} /></Box>
            <Box flex={1} />
            <IconButton aria-label="Уведомления" style={{ color: '#fff' }}>◔</IconButton>
            <Button style={{ minWidth: 36, width: 36, height: 36, padding: 0, borderRadius: '50%', color: '#1D2023', background: '#E1F3FD' }}>АИ</Button>
        </Box>
        <Box display="flex" flex={1}>
            <Box component="aside" width={228} bgcolor="background.paper" borderRight="1px solid #D0D3D6" p={2} flexShrink={0}>
                <Box mb={3} px={1}><Typography variant="caption" color="textSecondary">НАВИГАЦИЯ</Typography></Box>
                {['overview', 'incidents', 'analytics', 'settings'].map(item => <Box key={item} mb={0.5}><Button fullWidth onClick={() => { window.location.search = `?id=set-mark-screens--${item}&viewMode=story` }} color={active === item ? 'primary' : 'default'} style={{ justifyContent: 'flex-start', textTransform: 'none' }}>{item === 'overview' ? '▦  Обзор' : item === 'incidents' ? '≡  Инциденты' : item === 'analytics' ? '⌁  Аналитика' : '⚙  Настройки'}</Button></Box>)}
                <Box mt={4} p={1.5} bgcolor="#F6F8F9" borderRadius={4}><Typography variant="caption">● Данные актуальны</Typography><Typography variant="caption" color="textSecondary" display="block">сегодня, 18:40</Typography></Box>
            </Box>
            <Box flex={1} minWidth={0}>{children}</Box>
        </Box>
    </Box>
    )
}

export const Overview = () => {
    const [priorityOnly, setPriorityOnly] = useState(false)
    const visible = priorityOnly ? incidents.filter(item => item[4]) : incidents

    return (
        <ScreenShell active="overview"><Box bgcolor="background.default" minHeight="100vh" p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h4">Мониторинг нарушений</Typography>
                    <Typography color="textSecondary">Сводка по сети «Север» за 22–28 июля 2026</Typography>
                </Box>
                <Button variant="contained">Выгрузить CSV</Button>
            </Box>

            <Paper elevation={1} style={{ padding: 20, marginBottom: 20, borderLeft: '4px solid #EB5757' }}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs>
                        <Typography variant="h6">Критические инциденты с риском автоштрафа</Typography>
                        <Typography color="textSecondary">Требуют первоочередного анализа · 3 магазина, 3 кассы</Typography>
                    </Grid>
                    <Grid item><Typography variant="h4" color="error">12</Typography></Grid>
                    <Grid item><Button onClick={() => setPriorityOnly(!priorityOnly)}>{priorityOnly ? 'Показать все' : 'Перейти к инцидентам'}</Button></Grid>
                </Grid>
            </Paper>

            <Grid container spacing={2} mb={3}>
                {[
                    ['Всего инцидентов', '1 248'], ['Критические', '64'], ['С риском автоштрафа', '12'], ['Недостаточно данных', '37'],
                ].map(([label, value]) => (
                    <Grid item xs={12} sm={6} md={3} key={label}>
                        <Paper elevation={1} style={{ padding: 16 }}><Typography color="textSecondary">{label}</Typography><Typography variant="h4">{value}</Typography></Paper>
                    </Grid>
                ))}
            </Grid>

            <Paper elevation={1} style={{ overflow: 'hidden' }}>
                <Box p={2} display="flex" justifyContent="space-between" alignItems="center"><Typography variant="h6">Инциденты</Typography><Chip label={`${visible.length} критических`} color="error" /></Box>
                {visible.map(item => <Box key={item[0]} p={2} borderTop="1px solid #D0D3D6" display="flex" justifyContent="space-between" alignItems="center"><Box><Typography variant="subtitle1">{item[0]} · {item[1]}</Typography><Typography color="textSecondary">{item[2]}</Typography></Box><Chip label={item[3]} color="error" /></Box>)}
            </Paper>
        </Box></ScreenShell>
    )
}

export const Incidents = () => (
    <ScreenShell active="incidents"><Box bgcolor="background.default" minHeight="100vh" p={3}>
        <Box mb={3}><Typography variant="h4">Инциденты</Typography><Typography color="textSecondary">Системные результаты анализа отклонений за 22–28 июля 2026</Typography></Box>
        <Box display="flex" gridGap={8} mb={2}>
            <Box component="input" placeholder="Поиск по номеру, магазину или нарушению" style={{ flex: 1, padding: 12, border: 0, background: '#F1F3F4', borderRadius: 4 }} />
            <Button variant="contained">Применить фильтры</Button>
        </Box>
        <Paper elevation={1} style={{ overflow: 'hidden' }}>
            {incidents.map(item => <Box key={item[0]} p={2} borderBottom="1px solid #D0D3D6" display="flex" justifyContent="space-between" alignItems="center"><Box><Typography variant="subtitle1">{item[0]} · {item[1]}</Typography><Typography color="textSecondary">{item[2]}</Typography></Box><Box display="flex" gridGap={8}><Chip label={item[3]} color="error" /><Chip label={item[4]} color="error" /></Box></Box>)}
        </Paper>
    </Box></ScreenShell>
)

export const Analytics = () => (
    <ScreenShell active="analytics"><Box bgcolor="background.default" minHeight="100vh" p={3}>
        <Box mb={3}><Typography variant="h4">Аналитика</Typography><Typography color="textSecondary">Динамика нарушений по выбранному часовому поясу сети</Typography></Box>
        <Grid container spacing={2} mb={3}>{[['Инциденты за период', '1 248'], ['Критические', '64'], ['С риском автоштрафа', '12'], ['Магазины выше порога', '7']].map(([label, value]) => <Grid item xs={12} sm={6} md={3} key={label}><Paper elevation={1} style={{ padding: 16 }}><Typography color="textSecondary">{label}</Typography><Typography variant="h4">{value}</Typography></Paper></Grid>)}</Grid>
        <Grid container spacing={2}><Grid item xs={12} md={7}><Paper elevation={1} style={{ padding: 20, height: 300 }}><Typography variant="h6">Динамика инцидентов</Typography><Box display="flex" alignItems="flex-end" height={220} gridGap={12} pt={3}>{[45, 60, 52, 76, 68, 90, 82].map((height, index) => <Box key={index} bgcolor={index === 5 ? '#EB5757' : '#66BCE8'} width="12%" height={`${height}%`} borderRadius="4px 4px 0 0" />)}</Box></Paper></Grid><Grid item xs={12} md={5}><Paper elevation={1} style={{ padding: 20, height: 300 }}><Typography variant="h6">Распределение результатов</Typography><Box mt={3} display="grid" gridGap={16}>{[['RA-01 · Нарушение', 48], ['RA-02 · Корректный сценарий', 21], ['RA-04 · Недостаточно данных', 17]].map(([label, value]) => <Box key={label}><Box display="flex" justifyContent="space-between"><Typography>{label}</Typography><Typography>{value}%</Typography></Box><Box bgcolor="#F1F3F4" height={8} mt={1}><Box bgcolor="#0091EA" width={`${value}%`} height="100%" /></Box></Box>)}</Box></Paper></Grid></Grid>
    </Box></ScreenShell>
)

export const Settings = () => (
    <ScreenShell active="settings"><Box bgcolor="background.default" minHeight="100vh" p={3}>
        <Box mb={3}><Typography variant="h4">Настройки мониторинга</Typography><Typography color="textSecondary">Доступно администраторам Set Mark</Typography></Box>
        <Paper elevation={1} style={{ padding: 20, marginBottom: 16 }}><Typography variant="h6">Источники данных</Typography>{[['Новая интеграция с API Честного знака', 'Деморежим', 'warn'], ['Данные кассового ПО', 'Доступно', 'success']].map(([label, status, color]) => <Box key={label} py={2} borderTop="1px solid #D0D3D6" mt={2} display="flex" justifyContent="space-between"><Box><Typography variant="subtitle1">{label}</Typography><Typography color="textSecondary">Получение результатов проверок и фактических действий кассового ПО.</Typography></Box><Chip label={status} color={color as any} /></Box>)}</Paper>
        <Paper elevation={1} style={{ padding: 20 }}><Typography variant="h6">Уведомления и хранение</Typography><Box py={2} borderTop="1px solid #D0D3D6" mt={2} display="flex" justifyContent="space-between"><Typography>Ежедневные уведомления</Typography><Button variant="contained">Включены</Button></Box><Box py={2} borderTop="1px solid #D0D3D6" display="flex" justifyContent="space-between"><Typography>Срок хранения данных</Typography><Chip label="365 дней" /></Box></Paper>
    </Box></ScreenShell>
)
