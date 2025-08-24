import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Select,
  DatePicker,
  message,
  Tag
} from 'antd';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const AttendanceTracking = () => {
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMembers();
    fetchEvents();
    fetchAttendance();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/members');
      setMembers(response.data);
    } catch (error) {
      message.error('Failed to fetch members');
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      message.error('Failed to fetch events');
    }
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await api.get('/members/attendance');
      setAttendance(response.data);
    } catch (error) {
      message.error('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordAttendance = async (values) => {
    try {
      await api.post('/members/attendance', {
        ...values,
        date: values.date.toISOString(),
      });
      message.success('Attendance recorded successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchAttendance();
    } catch (error) {
      message.error('Failed to record attendance');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'green';
      case 'absent':
        return 'red';
      case 'excused':
        return 'orange';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Member',
      dataIndex: 'member_id',
      key: 'member',
      render: (id) => {
        const member = members.find(m => m.id === id);
        return member ? `${member.first_name} ${member.last_name}` : 'N/A';
      },
    },
    {
      title: 'Event',
      dataIndex: 'event_id',
      key: 'event',
      render: (id) => {
        const event = events.find(e => e.id === id);
        return event ? event.name : 'N/A';
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('MMMM D, YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
  ];

  return (
    <div className='mt-18'>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Space style={{ justifyContent: 'space-between', width: '100%' }}>
            <Title level={2}>Attendance Tracking</Title>
            <Button
              type="primary"
              // onClick={() => setIsModalVisible(true)}
            >
              Record Attendance
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={attendance}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} records`,
            }}
          />

          <Modal
            title="Record Attendance"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
          >
            <Form form={form} onFinish={handleRecordAttendance} layout="vertical">
              <Form.Item
                name="member_id"
                label="Member"
                rules={[{ required: true, message: 'Please select a member' }]}
              >
                <Select>
                  {members.map(member => (
                    <Option key={member.id} value={member.id}>
                      {member.first_name} {member.last_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="event_id"
                label="Event"
                rules={[{ required: true, message: 'Please select an event' }]}
              >
                <Select>
                  {events.map(event => (
                    <Option key={event.id} value={event.id}>
                      {event.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: 'Please select a date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select a status' }]}
              >
                <Select>
                  <Option value="present">Present</Option>
                  <Option value="absent">Absent</Option>
                  <Option value="excused">Excused</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="notes"
                label="Notes"
              >
                <Select.TextArea rows={4} />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Record
                  </Button>
                  <Button onClick={() => setIsModalVisible(false)}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </Space>
      </Card>
    </div>
  );
};

export default AttendanceTracking; 