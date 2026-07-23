import React, { useState } from 'react';
import style from './AddConcert.module.css';
import { api } from '../../api/concerts-nostalgia-api';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import {
  modalTheme,
  inputTheme,
  selectTheme,
  rainbowBtnTheme,
  datePickerTheme,
} from '../../styles/antdesign-themes';
import {
  Row,
  Col,
  Flex,
  Form,
  Input,
  Modal,
  Button,
  Select,
  Upload,
  Tooltip,
  message,
  DatePicker,
  ConfigProvider,
} from 'antd';

export function AddConcert({ onCreate }) {
  const [rate, setRate] = useState();
  const [open, setOpen] = useState(false);

  const [concert, setConcert] = useState({
    tour: '',
    artist: '',
    year: 0,
    location: '',
    city: '',
    country: '',
    rating: 1,
    background: 'background-one',
  });

  function showModal() {
    setOpen(true);
  }

  function handleChange(event) {
    setConcert({ ...concert, [event.target.name]: event.target.value });
  }

  function handleRating(event, newValue) {
    setRate(newValue);
    setConcert({ ...concert, [event.target.name]: event.target.value });
  }

  const handleCancel = () => {
    setOpen(false);
    setConcert({
      tour: '',
      artist: '',
      year: 0,
      location: '',
      city: '',
      country: '',
      rating: 0,
      background: '',
    });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await api.post('/concerts/add', concert);

      console.log(response);

      onCreate(response.data);

      message.success({
        content: 'Concert created successfully!',
        duration: 2,
      });
      setOpen(false);
      setConcert({
        tour: '',
        artist: '',
        year: 0,
        location: '',
        city: '',
        country: '',
        rating: 0,
        background: '',
      });
    } catch (error) {
      console.log('Error creating concert:', error);
      message.error('Failed to create concert!');
    }
  }

  return (
    <>
      <div className={style['add-concert-fab']}>
        <ConfigProvider theme={rainbowBtnTheme}>
          <Tooltip title="New Concert" placement="left">
            <Button
              onClick={showModal}
              type="primary"
              shape="circle"
              icon={<PlusOutlined style={{ fontSize: '28px' }} />}
              size="large"
              style={{ width: '60px', height: '60px' }}
            />
          </Tooltip>
        </ConfigProvider>
      </div>
      <ConfigProvider
        theme={{
          components: {
            Modal: { ...modalTheme },
            Input: { ...inputTheme },
            Select: { ...selectTheme },
            DatePicker: { ...datePickerTheme },
          },
        }}
      >
        <Modal
          title="add new concert"
          width="550px"
          open={open}
          onOk={handleSubmit}
          okText="Create"
          onCancel={handleCancel}
          centered
          footer={[
            <>
              <ConfigProvider theme={rainbowBtnTheme}>
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  style={{ width: '100px' }}
                >
                  Create
                </Button>
              </ConfigProvider>
            </>,
          ]}
        >
          <Form
            layout={'vertical'}
            style={{
              backgroundColor: '#212121',
            }}
          >
            <Flex gap="middle" justify="space-between">
              <Row
                style={{
                  width: 240,
                }}
              >
                <Col span={24}>
                  <Form.Item
                    label={
                      <label style={{ color: '#ffffff' }}>tour / concert</label>
                    }
                  >
                    <Input
                      name="tour"
                      placeholder="enter tour"
                      value={concert.tour}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item
                    label={<label style={{ color: '#ffffff' }}>location</label>}
                  >
                    <Input
                      name="location"
                      placeholder="enter location"
                      value={concert.location}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item
                    label={<label style={{ color: '#ffffff' }}>country</label>}
                  >
                    <Input
                      name="country"
                      placeholder="enter country"
                      value={concert.country}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item
                    name="rating"
                    label={<label style={{ color: '#ffffff' }}>rating</label>}
                    onChange={handleRating}
                    placeholder="choose a rate"
                    // value={concert.rating}
                  >
                    <Select
                      placeholder="choose a rate"
                      name="rating"
                      value={concert.rating}
                      onChange={(value) =>
                        setConcert({ ...concert, rating: parseInt(value, 10) })
                      }
                    >
                      <Select.Option value={1}>1</Select.Option>
                      <Select.Option value={2}>2</Select.Option>
                      <Select.Option value={3}>3</Select.Option>
                      <Select.Option value={4}>4</Select.Option>
                      <Select.Option value={5}>5</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row
                style={{
                  width: 240,
                }}
              >
                <Col span={24}>
                  <Form.Item
                    label={
                      <label style={{ color: '#ffffff' }}>artist / band</label>
                    }
                  >
                    <Input
                      name="artist"
                      placeholder="enter artist"
                      value={concert.artist}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item
                    label={<label style={{ color: '#ffffff' }}>year</label>}
                  >
                    <DatePicker
                      name="year"
                      placeholder="enter year"
                      // value={concert.year}
                      picker="year"
                      style={{
                        width: 240,
                      }}
                      onChange={(date, dateString) => {
                        const year = date ? date.year() : 0;
                        setConcert({ ...concert, year });
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label={<label style={{ color: '#ffffff' }}>city</label>}
                  >
                    <Input
                      name="city"
                      placeholder="enter city"
                      value={concert.city}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Form.Item
                    label={
                      <label style={{ color: '#ffffff' }}>ticket style</label>
                    }
                    onChange={handleChange}
                  >
                    <Select
                      placeholder="choose ticket style"
                      name="background"
                      // value={concert.background}
                      onChange={(value) =>
                        setConcert({ ...concert, background: value })
                      }
                    >
                      <Select.Option value="background-one">
                        style one
                      </Select.Option>
                      <Select.Option value="background-two">
                        style two
                      </Select.Option>
                      <Select.Option value="background-three">
                        style three
                      </Select.Option>
                      <Select.Option value="background-four">
                        style four
                      </Select.Option>
                      <Select.Option value="background-five">
                        style five
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Flex>
            <Form.Item
              label={<label style={{ color: '#ffffff' }}>images</label>}
            >
              <Form.Item name="dragger" valuePropName="fileList" noStyle>
                <Upload.Dragger name="files" action="/upload.do" disabled>
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined
                      style={{ fontSize: '40px', color: '#ffffff' }}
                    />
                  </p>
                  <p className="ant-upload-text" style={{ color: '#ffffff' }}>
                    Click or drag image to this area to upload
                  </p>
                  <p className="ant-upload-hint" style={{ color: '#ffffff' }}>
                    Support for a single or bulk upload
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Form.Item>
          </Form>
        </Modal>
      </ConfigProvider>
    </>
  );
}
