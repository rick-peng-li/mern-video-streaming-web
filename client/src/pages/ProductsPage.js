import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';
// @mui
import { Container, Stack, Typography } from '@mui/material';
// components
import { ProductSort, VideoList, ProductCartWidget, ProductFilterSidebar } from '../sections/@dashboard/products';
import { API_SERVER } from '../constants';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.post(`${API_SERVER}/api/videos/search`, {});
      const list = Array.isArray(response.data) ? response.data : [];
      // Products page shows the top-viewed featured content
      list.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      setVideos(list);
    };
    getData();
  }, []);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <>
      <Helmet>
        <title> Dashboard: Featured Videos | Video Streaming </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Featured Videos
        </Typography>

        <Stack direction="row" flexWrap="wrap-reverse" alignItems="center" justifyContent="flex-end" sx={{ mb: 5 }}>
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            <ProductFilterSidebar
              openFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            />
            <ProductSort />
          </Stack>
        </Stack>

        <VideoList videos={videos} />
        <ProductCartWidget />
      </Container>
    </>
  );
}
