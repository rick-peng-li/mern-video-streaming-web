import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { API_SERVER } from '../constants';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const [videoCount, setVideoCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [publishedCount, setPublishedCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [videoRes, userRes] = await Promise.all([
          axios.post(`${API_SERVER}/api/videos/count`, {}),
          axios.post(`${API_SERVER}/api/users/count`, {}),
        ]);
        setVideoCount(videoRes.data.count || 0);
        setUserCount(userRes.data.count || 0);

        const searchRes = await axios.post(`${API_SERVER}/api/videos/search`, { limit: 100 });
        const videos = searchRes.data || [];
        const views = videos.reduce((sum, v) => sum + (v.viewCount || 0), 0);
        setTotalViews(views);
        setPublishedCount(videos.length);
      } catch (error) {
        console.error('Fetch stats failed:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard | Video Streaming </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Videos" total={videoCount} icon={'mdi:video'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Users" total={userCount} color="info" icon={'mdi:account-group'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Published Videos" total={publishedCount} color="warning" icon={'mdi:video-check'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Total Views" total={totalViews} color="error" icon={'mdi:eye'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(Video views trend)"
              chartLabels={[
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
              ]}
              chartData={[
                {
                  name: 'Videos Uploaded',
                  type: 'column',
                  fill: 'solid',
                  data: [videoCount, videoCount * 1.1, videoCount * 1.3, videoCount * 1.2, videoCount * 1.5, videoCount * 1.4, videoCount * 1.6, videoCount * 1.8, videoCount * 1.7, videoCount * 2, videoCount * 1.9, videoCount * 2.1].map(v => Math.round(v)),
                },
                {
                  name: 'Views',
                  type: 'area',
                  fill: 'gradient',
                  data: [totalViews, totalViews * 1.1, totalViews * 1.2, totalViews * 1.4, totalViews * 1.3, totalViews * 1.5, totalViews * 1.6, totalViews * 1.8, totalViews * 1.7, totalViews * 2, totalViews * 1.9, totalViews * 2.2].map(v => Math.round(v)),
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Video Categories"
              chartData={[
                { label: 'Education', value: Math.round(videoCount * 0.35) },
                { label: 'Technology', value: Math.round(videoCount * 0.30) },
                { label: 'Travel', value: Math.round(videoCount * 0.20) },
                { label: 'Others', value: Math.round(videoCount * 0.15) },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Uploads by Category"
              subheader="Video distribution"
              chartData={[
                { label: 'Education', value: Math.round(videoCount * 0.35 * 100) },
                { label: 'Technology', value: Math.round(videoCount * 0.30 * 100) },
                { label: 'Travel', value: Math.round(videoCount * 0.20 * 100) },
                { label: 'Others', value: Math.round(videoCount * 0.15 * 100) },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="User Activity"
              chartLabels={['Uploads', 'Views', 'Likes', 'Comments', 'Shares', 'Saves']}
              chartData={[
                { name: 'This Month', data: [videoCount, totalViews, Math.round(totalViews * 0.1), Math.round(totalViews * 0.05), Math.round(totalViews * 0.02), Math.round(totalViews * 0.03)] },
                { name: 'Last Month', data: [Math.round(videoCount * 0.8), Math.round(totalViews * 0.75), Math.round(totalViews * 0.08), Math.round(totalViews * 0.04), Math.round(totalViews * 0.015), Math.round(totalViews * 0.025)] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="Recent Videos"
              list={[...Array(5)].map((_, index) => ({
                id: `video-${index}`,
                title: `Sample Video Title ${index + 1}`,
                description: `Video description ${index + 1} - category Education`,
                image: `/assets/images/covers/cover_${(index % 3) + 1}.jpg`,
                postedAt: new Date(Date.now() - index * 86400000),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Recent Activities"
              list={[...Array(5)].map((_, index) => ({
                id: `activity-${index}`,
                title: [
                  'New video uploaded',
                  'User registered',
                  'Video processed',
                  'Comment added',
                  'Video view milestone reached',
                ][index],
                type: `order${index + 1}`,
                time: new Date(Date.now() - index * 3600000),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Source"
              list={[
                {
                  name: 'Direct',
                  value: Math.round(totalViews * 0.4),
                  icon: <Iconify icon={'mdi:web'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Search',
                  value: Math.round(totalViews * 0.3),
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Social',
                  value: Math.round(totalViews * 0.2),
                  icon: <Iconify icon={'eva:share-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Referral',
                  value: Math.round(totalViews * 0.1),
                  icon: <Iconify icon={'mdi:link-variant'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Admin Tasks"
              list={[
                { id: '1', label: 'Review pending videos' },
                { id: '2', label: 'Process transcoding queue' },
                { id: '3', label: 'User report review' },
                { id: '4', label: 'Backup database' },
                { id: '5', label: 'System health check' },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
