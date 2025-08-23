import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tag
} from 'antd';
import { PlusOutlined, UserAddOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const FamilyManagement = () => {
  const [families, setFamilies] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedFamily, setSelectedFamily] = useState(null);

  useEffect(() => {
    fetchFamilies();
    fetchMembers();
  }, []);

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/members/families/');
      setFamilies(response.data);
    } catch (error) {
      message.error('Failed to fetch families');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/members/');
      setMembers(response.data);
    } catch (error) {
      message.error('Failed to fetch members');
    }
  };

  const handleCreateFamily = async (values) => {
    try {
      await axios.post('http://localhost:8000/members/families/', values);
      message.success('Family created successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchFamilies();
    } catch (error) {
      message.error('Failed to create family');
    }
  };

  const handleAddFamilyMember = async (familyId, values) => {
    try {
      await axios.post(`http://localhost:8000/members/families/${familyId}/members`, values);
      message.success('Family member added successfully');
      fetchFamilies();
    } catch (error) {
      message.error('Failed to add family member');
    }
  };

  const columns = [
    {
      title: 'Family Name',
      dataIndex: 'family_name',
      key: 'family_name',
    },
    {
      title: 'Head of Family',
      dataIndex: 'head_of_family_id',
      key: 'head_of_family_id',
      render: (id) => {
        const member = members.find(m => m.id === id);
        return member ? `${member.first_name} ${member.last_name}` : 'N/A';
      },
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Members',
      key: 'members',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => {
              setSelectedFamily(record);
              form.resetFields();
            }}
          >
            Add Member
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className='mt-18'>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Space style={{ justifyContent: 'space-between', width: '100%' }}>
            <Title level={2}>Family Management</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              Create Family
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={families}
            rowKey="id"
            loading={loading}
          />

          {/* Create Family Modal */}
          <Modal
            title="Create New Family"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
          >
            <Form form={form} onFinish={handleCreateFamily} layout="vertical">
              <Form.Item
                name="family_name"
                label="Family Name"
                rules={[{ required: true, message: 'Please enter family name' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="head_of_family_id"
                label="Head of Family"
                rules={[{ required: true, message: 'Please select head of family' }]}
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
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter address' }]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Create
                  </Button>
                  <Button onClick={() => setIsModalVisible(false)}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>

          {/* Add Family Member Modal */}
          <Modal
            title={`Add Member to ${selectedFamily?.family_name}`}
            open={Boolean(selectedFamily)}
            onCancel={() => setSelectedFamily(null)}
            footer={null}
          >
            <Form
              form={form}
              onFinish={(values) => {
                handleAddFamilyMember(selectedFamily.id, values);
                setSelectedFamily(null);
              }}
              layout="vertical"
            >
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
                name="relationship"
                label="Relationship"
                rules={[{ required: true, message: 'Please select relationship' }]}
              >
                <Select>
                  <Option value="spouse">Spouse</Option>
                  <Option value="child">Child</Option>
                  <Option value="parent">Parent</Option>
                  <Option value="sibling">Sibling</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Add
                  </Button>
                  <Button onClick={() => setSelectedFamily(null)}>
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

export default FamilyManagement; 