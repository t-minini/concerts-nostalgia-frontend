import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { UploadOutlined } from '@ant-design/icons';
import { api } from '../../api/concerts-nostalgia-api';
import {
  modalTheme,
  inputTheme,
  selectTheme,
  simpleBtnTheme,
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
  Select,
  Upload,
  Button,
  message,
  ConfigProvider,
} from 'antd';

function DisabledFieldGuard({ disabled, children }) {
  return (
    <div style={{ position: 'relative' }}>
      {children}
      {disabled && (
        <div
          style={{ position: 'absolute', inset: 0, cursor: 'not-allowed' }}
          onClick={() =>
            message.info({
              content: 'Click Edit to update',
              duration: 2,
            })
          }
        />
      )}
    </div>
  );
}

export function ConcertDetails(currentConcert) {
  const [open, setOpen] = useState(false);
  const [hoverPos, setHoverPos] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [concertData, setConcertData] = useState(currentConcert.concerts);

  function showModal() {
    setOpen(true);
  }

  useEffect(() => {
    setConcertData(currentConcert.concerts);
  }, [currentConcert.concerts]);

  function handleCancel() {
    setOpen(false);
    setEditMode(false);
  }

  function handleChange(event) {
    setConcertData({ ...concertData, [event.target.name]: event.target.value });
  }

  function handleEdit() {
    setEditMode(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setConfirmLoading(true);
    try {
      const clone = { ...concertData };

      delete clone._id;
      await api.put(`/concerts/edit/${concertData._id}`, clone);
      currentConcert.onUpdate(concertData);

      message.loading({ content: 'Updating concert...', duration: 2 });
      setTimeout(() => {
        message.success({
          content: 'Concert updated successfully!',
          duration: 2,
        });
        setOpen(false);
        setEditMode(false);
        setConfirmLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      setConfirmLoading(false);
      message.error('Failed to update concert!');
    }
  }

  async function handleDelete() {
    try {
      await api.delete(`/concerts/delete/${concertData._id}`);
      currentConcert.onDelete(concertData._id);

      message.success({
        content: 'Concert deleted successfully!',
        duration: 2,
      });
    } catch (error) {
      console.log(error);
      message.error('Failed to delete concert!');
    }
    setOpen(false);
  }

  function handleRating(value) {
    setConcertData({ ...concertData, rating: value });
  }

  const editAndSaveBtn = editMode ? (
    <>
      <ConfigProvider theme={simpleBtnTheme}>
        <Button onClick={handleDelete} style={{ width: '80px' }}>
          Delete
        </Button>
      </ConfigProvider>
      <ConfigProvider theme={rainbowBtnTheme}>
        <Button
          type="primary"
          onClick={handleSubmit}
          style={{ width: '100px' }}
        >
          Save
        </Button>
      </ConfigProvider>
    </>
  ) : (
    <ConfigProvider theme={rainbowBtnTheme}>
      <Button type="primary" onClick={handleEdit} style={{ width: '100px' }}>
        Edit
      </Button>
    </ConfigProvider>
  );

  return (
    <>
      <span
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        onClick={showModal}
        onMouseMove={(event) =>
          setHoverPos({ x: event.clientX, y: event.clientY })
        }
        onMouseLeave={() => setHoverPos(null)}
      ></span>
      {hoverPos &&
        createPortal(
          <div
            style={{
              top: hoverPos.y + 12,
              left: hoverPos.x + 12,
              position: 'fixed',
              zIndex: 1000,
              padding: '6px 8px',
              fontSize: '14px',
              lineHeight: '1.5714285714285714',
              color: '#ffffff',
              borderRadius: '6px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              boxShadow:
                '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            Click to edit
          </div>,
          document.body
        )}
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
          title="concert details"
          width="550px"
          open={open}
          onOk={handleSubmit}
          okText="Save"
          cancelText="Delete"
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          centered
          footer={[editAndSaveBtn]}
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
                    <DisabledFieldGuard disabled={!editMode}>
                      <Input
                        name="tour"
                        placeholder="enter tour"
                        value={concertData.tour}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </DisabledFieldGuard>
                  </Form.Item>
                  <Form.Item
                    label={<label style={{ color: '#ffffff' }}>location</label>}
                  >
                    <DisabledFieldGuard disabled={!editMode}>
                      <Input
                        name="location"
                        placeholder="enter location"
                        value={concertData.location}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </DisabledFieldGuard>
                  </Form.Item>
                  <Form.Item
                    label={<label style={{ color: '#ffffff' }}>country</label>}
                  >
                    <DisabledFieldGuard disabled={!editMode}>
                      <Input
                        name="country"
                        placeholder="enter country"
                        value={concertData.country}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </DisabledFieldGuard>
                  </Form.Item>
                  <Form.Item
                    label={<label style={{ color: '#ffffff' }}>rating</label>}
                  >
                    <DisabledFieldGuard disabled={!editMode}>
                      <Select
                        placeholder="choose a rate"
                        name="rating"
                        value={concertData.rating}
                        disabled={!editMode}
                        onChange={handleRating}
                      >
                        <Select.Option value={1}>1</Select.Option>
                        <Select.Option value={2}>2</Select.Option>
                        <Select.Option value={3}>3</Select.Option>
                        <Select.Option value={4}>4</Select.Option>
                        <Select.Option value={5}>5</Select.Option>
                      </Select>
                    </DisabledFieldGuard>
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
                    label={<label style={{ color: '#ffffff' }}>artist</label>}
                  >
                    <DisabledFieldGuard disabled={!editMode}>
                      <Input
                        name="artist"
                        placeholder="enter artist"
                        value={concertData.artist}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </DisabledFieldGuard>
                  </Form.Item>
                  <Form.Item
                    label={<label style={{ color: '#ffffff' }}>year</label>}
                  >
                    <DisabledFieldGuard disabled={!editMode}>
                      <Input
                        name="year"
                        placeholder="enter year"
                        value={concertData.year}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </DisabledFieldGuard>
                  </Form.Item>
                  <Form.Item
                    label={<label style={{ color: '#ffffff' }}>city</label>}
                  >
                    <DisabledFieldGuard disabled={!editMode}>
                      <Input
                        name="city"
                        placeholder="enter city"
                        value={concertData.city}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </DisabledFieldGuard>
                  </Form.Item>
                  <Form.Item
                    label={
                      <label style={{ color: '#ffffff' }}>ticket style</label>
                    }
                    onChange={handleChange}
                  >
                    <DisabledFieldGuard disabled={!editMode}>
                      <Select
                        placeholder="choose ticket style"
                        name="background"
                        value={concertData.background}
                        disabled={!editMode}
                        onChange={(value) =>
                          setConcertData({ ...concertData, background: value })
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
                    </DisabledFieldGuard>
                  </Form.Item>
                </Col>
              </Row>
            </Flex>
            <Form.Item
              label={<label style={{ color: '#ffffff' }}>images</label>}
              style={{ display: 'none' }}
            >
              <Form.Item
                name="dragger"
                valuePropName="fileList"
                // getValueFromEvent={normFile}
                noStyle
              >
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
