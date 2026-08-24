import PropTypes from 'prop-types';
// @mui
import { Box, Card, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Link } from "react-router-dom";

// utils
// components
import Label from '../../../components/label';

// ----------------------------------------------------------------------

const StyledProductImg = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

const pad = (n) => String(n).padStart(2, '0');

const formatDate = (value) => {
  if (!value) return '-';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const formatDuration = (seconds) => {
  const total = Number(seconds) || 0;
  const abs = Math.max(0, Math.floor(total));
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

// ----------------------------------------------------------------------

VideoCard.propTypes = {
  video: PropTypes.object,
};

export default function VideoCard({ video }) {
  const {
    title: name,
    thumbnailUrl: cover,
    viewCount,
    duration,
    status,
    recordingDate,
    _id: id,
  } = video || {};

  const onClickHandler = () => {
    console.log('clicked', video);
  };

  return (
    <Card onClick={onClickHandler}>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {status && (
          <Label
            variant='filled'
            color={(status === 'sale' && 'error') || 'info'}
            sx={{
              zIndex: 9,
              top: 16,
              right: 16,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Label>
        )}
        <StyledProductImg alt={name || ''} src={cover || ''} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
            <Link to={id || '#'} color='inherit' underline='hover'>
              <Typography variant='subtitle2' noWrap>
                {name || '-'}
              </Typography>
            </Link>
            <Typography variant='subtitle1'>
              {formatDate(recordingDate)}
            </Typography>
          </Stack>
          
          <Stack direction='row' alignItems='center' justifyContent='space-between'>
            <Typography variant='subtitle1'>{viewCount || 0} views</Typography>
            <Typography variant='subtitle1'>
              {formatDuration(duration)}
            </Typography>
          </Stack>
      </Stack>
    </Card>
  );
}
