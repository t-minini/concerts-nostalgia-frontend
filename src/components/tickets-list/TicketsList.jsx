import style from './TicketsList.module.css';
import { useState, useEffect, useMemo } from 'react';
import { Select, Button, Tooltip, ConfigProvider } from 'antd';
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import { api } from '../../api/concerts-nostalgia-api';
import { selectTheme, rainbowBtnTheme } from '../../styles/antdesign-themes';
import { AddConcert } from '../add-concert/AddConcert';
import { ConcertDetails } from './../concert-details/ConcertDetails';

const SORT_OPTIONS = [
  { value: 'year', label: 'year / month' },
  { value: 'tour', label: 'tour / concert' },
  { value: 'artist', label: 'artist / band' },
  { value: 'location', label: 'location' },
  { value: 'city', label: 'city' },
  { value: 'country', label: 'country' },
  { value: 'rating', label: 'rating' },
];

const NUMERIC_SORT_FIELDS = new Set(['year', 'rating']);

export function TicketsList() {
  const [concerts, setConcerts] = useState([
    {
      tour: '',
      artist: '',
      year: 0,
      location: '',
      city: '',
      country: '',
      rating: 0,
      background: '',
    },
  ]);

  useEffect(() => {
    async function fetchConcerts() {
      try {
        const response = await api.get('/concerts/');
        setConcerts(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchConcerts();
  }, []);

  function handleConcertCreated(newConcert) {
    setConcerts((prev) => [...prev, newConcert]);
  }

  function handleConcertUpdated(updatedConcert) {
    setConcerts((prev) =>
      prev.map((c) => (c._id === updatedConcert._id ? updatedConcert : c))
    );
  }

  function handleConcertDeleted(id) {
    setConcerts((prev) => prev.filter((c) => c._id !== id));
  }

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const effectiveSortField = sortField ?? 'year';

  const sortedConcerts = useMemo(() => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    const sorted = [...concerts];
    if (NUMERIC_SORT_FIELDS.has(effectiveSortField)) {
      sorted.sort(
        (a, b) =>
          ((a[effectiveSortField] ?? 0) - (b[effectiveSortField] ?? 0)) *
          direction
      );
    } else {
      sorted.sort(
        (a, b) =>
          (a[effectiveSortField] ?? '').localeCompare(
            b[effectiveSortField] ?? ''
          ) * direction
      );
    }
    return sorted;
  }, [concerts, effectiveSortField, sortDirection]);

  const Rating = ({ rating }) => {
    const filledStars = Array.from({ length: rating }, (_, ratingIndex) => (
      <span key={ratingIndex} className={style['ticket__container-rate']}>
        &#11088;
      </span>
    ));

    const emptyStars = Array.from({ length: 5 - rating }, (_, ratingIndex) => (
      <span key={ratingIndex + rating} className={style['empty-star']}>
        &#9734;
      </span>
    ));

    return (
      <>
        {filledStars}
        {emptyStars}
      </>
    );
  };

  return (
    <section id="tickets" className={style.tickets}>
      <div className={style['ticket__title-container']}>
        <h2 className={style.tickets__title}>concerts</h2>
        <div className={style['sort-controls']}>
          <ConfigProvider theme={{ components: { Select: { ...selectTheme } } }}>
            <Select
              allowClear
              size="large"
              placeholder="sort by"
              options={SORT_OPTIONS}
              value={sortField ?? undefined}
              onChange={(value) => setSortField(value ?? null)}
              className={style['sort-select']}
            />
          </ConfigProvider>
          <ConfigProvider theme={rainbowBtnTheme}>
            <Tooltip
              title={
                sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'
              }
            >
              <Button
                type="primary"
                shape="circle"
                className={style['sort-direction-btn']}
                onClick={() =>
                  setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                }
                icon={
                  sortDirection === 'asc' ? (
                    <SortAscendingOutlined />
                  ) : (
                    <SortDescendingOutlined />
                  )
                }
              />
            </Tooltip>
          </ConfigProvider>
        </div>
      </div>
      <hr className={style['tickets__break']} />
      <div className={style.tickets__wrapper}>
        {sortedConcerts.map((currentConcert) => {
          return (
            <div
              className={`${style.ticket__container} ${
                style[currentConcert.background]
              }`}
              key={`${currentConcert._id}concerts`}
            >
              <ConcertDetails
                concerts={currentConcert}
                onUpdate={handleConcertUpdated}
                onDelete={handleConcertDeleted}
              />
              <div className={style['ticket__container-info']}>
                <p className={style['ticket__container-tour']}>
                  {currentConcert.tour}
                </p>
                <p className={style['ticket__container-artist']}>
                  {currentConcert.artist}
                </p>
                <Rating rating={currentConcert.rating} />
                <p className={style['ticket__container-venue']}>
                  {currentConcert.location}
                </p>
                <div className={style['ticket__container-city-country']}>
                  <p className={style['ticket__container-city']}>
                    {currentConcert.city},&nbsp;
                  </p>
                  <p className={style['ticket__container-country']}>
                    {currentConcert.country}
                  </p>
                </div>
                <p className={style['ticket__container-date']}>
                  {currentConcert.year}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <AddConcert onCreate={handleConcertCreated} />
    </section>
  );
}
