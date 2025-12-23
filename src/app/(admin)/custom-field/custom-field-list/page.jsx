'use client';

import PageTItle from '@/components/PageTItle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { fetchCustomFields, deleteCustomField, updateCustomField } from '@/utils/customFieldApi';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardFooter, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Spinner, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useModal from '@/hooks/useModal';

const toastify = ({ props, message }) => {
  toast(message, {
    ...props,
    hideProgressBar: true,
    theme: 'colored',
    icon: false
  });
};

const CustomFieldListPage = () => {
  const { isOpen, toggleModal } = useModal();
  const [editingItem, setEditingItem] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [fieldType, setFieldType] = useState('text');
  const [entityType, setEntityType] = useState('product');
  const [isRequired, setIsRequired] = useState('no');
  const [isActive, setIsActive] = useState(true);
  const [code, setCode] = useState('');
  
  const [customFieldData, setCustomFieldData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 1
  });

  const messageSchema = yup.object({
    name: yup.string().required('Please enter Field Name'),
    label: yup.string().required('Please enter Display Label')
  });

  const { handleSubmit, control, reset, setValue } = useForm({
    resolver: yupResolver(messageSchema)
  });

  const loadCustomFields = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const response = await fetchCustomFields({ page, size: pagination.size });
      if (response.success) {
        setCustomFieldData(response.items);
        setPagination({
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages
        });
      }
    } catch (error) {
      console.error('Error loading custom fields:', error);
      toastify({
        message: 'Custom field verileri yüklenirken hata oluştu',
        props: { type: 'error', position: 'top-right' }
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.size]);

  useEffect(() => {
    loadCustomFields();
  }, [loadCustomFields]);

  const handleDelete = async (uuid) => {
    if (!confirm('Bu custom field\'ı silmek istediğinizden emin misiniz?')) return;
    
    try {
      const response = await deleteCustomField(uuid);
      if (response.success) {
        toastify({
          message: 'Custom field başarıyla silindi',
          props: { type: 'success', position: 'top-right' }
        });
        loadCustomFields(pagination.page);
      } else {
        toastify({
          message: response.message || 'Silme işlemi başarısız',
          props: { type: 'error', position: 'top-right' }
        });
      }
    } catch (error) {
      toastify({
        message: 'Silme işlemi sırasında hata oluştu',
        props: { type: 'error', position: 'top-right' }
      });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setValue('name', item.name || '');
    setValue('label', item.label || item.name || '');
    setCode(item.code || item.name || '');
    setValue('placeholder', item.placeholder || '');
    setValue('defaultValue', item.defaultValue || '');
    setValue('options', Array.isArray(item.options) && item.options.length > 0 ? item.options.join(', ') : '');
    setFieldType(item.type || 'text');
    setEntityType(item.entityType || 'product');
    setIsRequired(item.isRequired ? 'yes' : 'no');
    setIsActive(item.isActive !== undefined ? item.isActive : true);
    toggleModal();
  };

  const handleUpdate = async (data) => {
    if (!editingItem) return;
    
    setEditLoading(true);
    try {
      const payload = {
        name: data.name,
        code: code || data.name,
        label: data.label,
        type: fieldType,
        entityType: entityType,
        placeholder: data.placeholder || '',
        defaultValue: data.defaultValue || '',
        options: data.options ? data.options.split(',').map(opt => opt.trim()) : [],
        isRequired: isRequired === 'yes',
        isActive: isActive
      };

      const response = await updateCustomField(editingItem.uuid, payload);
      if (response.success) {
        toastify({
          message: 'Custom field başarıyla güncellendi',
          props: { type: 'success', position: 'top-right' }
        });
        toggleModal();
        setEditingItem(null);
        loadCustomFields(pagination.page);
      } else {
        toastify({
          message: response.message || 'Custom field güncellenemedi',
          props: { type: 'error', position: 'top-right' }
        });
      }
    } catch (error) {
      console.error('Error updating custom field:', error);
      toastify({
        message: error.message || 'Custom field güncellenirken hata oluştu',
        props: { type: 'error', position: 'top-right' }
      });
    } finally {
      setEditLoading(false);
    }
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      text: 'secondary',
      number: 'info',
      date: 'success',
      select: 'primary',
      checkbox: 'danger',
      textarea: 'warning'
    };
    return colors[type] || 'secondary';
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, pagination.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li key={i} className={`page-item ${pagination.page === i ? 'active' : ''}`}>
          <button className="page-link" onClick={() => loadCustomFields(i)}>
            {i + 1}
          </button>
        </li>
      );
    }

    return (
      <ul className="pagination justify-content-end mb-0">
        <li className={`page-item ${pagination.page === 0 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => loadCustomFields(pagination.page - 1)} disabled={pagination.page === 0}>
            Previous
          </button>
        </li>
        {pages}
        <li className={`page-item ${pagination.page >= pagination.totalPages - 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => loadCustomFields(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages - 1}>
            Next
          </button>
        </li>
      </ul>
    );
  };

  return <>
      <PageTItle title="CUSTOM FIELD LIST" />
      <Row>
        <Col xl={12}>
          <Card>
            <div className="d-flex card-header justify-content-between align-items-center">
              <div>
                <CardTitle as={'h4'} className="card-title">
                  All Custom Field List
                </CardTitle>
              </div>
              <div className="d-flex gap-2">
                <Link href="/custom-field/custom-field-add" className="btn btn-primary btn-sm">
                  <IconifyIcon icon="solar:add-circle-broken" className="align-middle fs-18 me-1" />
                  Add New
                </Link>
                <Dropdown>
                  <DropdownToggle className="btn btn-sm btn-outline-light content-none icons-center" data-bs-toggle="dropdown" aria-expanded="false">
                    This Month <IconifyIcon className="ms-1" width={16} height={16} icon="bx:chevron-down" />
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem>Download</DropdownItem>
                    <DropdownItem>Export</DropdownItem>
                    <DropdownItem>Import</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            <div>
              <div className="table-responsive">
                <table className="table align-middle mb-0 table-hover table-centered">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th style={{ width: 20 }}>
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="customCheck1" />
                          <label className="form-check-label" htmlFor="customCheck1" />
                        </div>
                      </th>
                      <th>Name</th>
                      <th>Label</th>
                      <th>Type</th>
                      <th>Entity</th>
                      <th>Required</th>
                      <th>Created On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          <Spinner animation="border" variant="primary" />
                        </td>
                      </tr>
                    ) : customFieldData.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          Henüz custom field bulunmuyor
                        </td>
                      </tr>
                    ) : (
                      customFieldData.map((item, idx) => <tr key={item.uuid || idx}>
                        <td>
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input" id={`customCheck${idx}`} />
                            <label className="form-check-label" htmlFor={`customCheck${idx}`}>
                              &nbsp;
                            </label>
                          </div>
                        </td>
                        <td>{item.name}</td>
                        <td>{item.label}</td>
                        <td>
                          <span className={`badge bg-${getTypeBadgeColor(item.type)}-subtle text-${getTypeBadgeColor(item.type)}`}>
                            {item.type}
                          </span>
                        </td>
                        <td>{item.entityType}</td>
                        <td>
                          {item.isRequired ? <span className="badge bg-success-subtle text-success">Yes</span> : <span className="badge bg-secondary-subtle text-secondary">No</span>}
                        </td>
                        <td>{item.createdAt ? new Date(item.createdAt).toLocaleString('en-us', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : '-'}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button onClick={() => handleEdit(item)} className="btn btn-soft-primary btn-sm">
                              <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                            </button>
                            <button onClick={() => handleDelete(item.uuid)} className="btn btn-soft-danger btn-sm">
                              <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                            </button>
                          </div>
                        </td>
                      </tr>)
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <CardFooter className="border-top">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">
                  Toplam {pagination.totalElements} kayıt
                </span>
                <nav aria-label="Page navigation example">
                  {renderPagination()}
                </nav>
              </div>
            </CardFooter>
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal show={isOpen} onHide={toggleModal} size="lg">
        <form onSubmit={handleSubmit(handleUpdate)}>
          <ModalHeader>
            <ModalTitle>Edit Custom Field</ModalTitle>
            <button type="button" className="btn-close" onClick={toggleModal} />
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col lg={6}>
                <div className="mb-3">
                  <TextFormInput control={control} type="text" name="name" label="Field Name" placeholder="Enter Field Name" />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <label htmlFor="code" className="form-label">
                    Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    className="form-control"
                    placeholder="Enter Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <TextFormInput control={control} type="text" name="label" label="Display Label" placeholder="Enter Display Label" />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <label htmlFor="fieldType" className="form-label">
                    Field Type
                  </label>
                  <ChoicesFormInput 
                    className="form-control" 
                    id="fieldType" 
                    data-choices 
                    data-choices-groups 
                    data-placeholder="Select Field Type"
                    defaultValue={fieldType}
                    onChange={(val) => setFieldType(val)}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="select">Select</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="textarea">Textarea</option>
                  </ChoicesFormInput>
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <label htmlFor="entity" className="form-label">
                    Entity
                  </label>
                  <ChoicesFormInput 
                    className="form-control" 
                    id="entity" 
                    data-choices 
                    data-choices-groups 
                    data-placeholder="Select Entity"
                    defaultValue={entityType}
                    onChange={(val) => setEntityType(val)}
                  >
                    <option value="product">Product</option>
                    <option value="category">Category</option>
                    <option value="order">Order</option>
                    <option value="customer">Customer</option>
                    <option value="user">User</option>
                  </ChoicesFormInput>
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <label htmlFor="required" className="form-label">
                    Required
                  </label>
                  <ChoicesFormInput 
                    className="form-control" 
                    id="required" 
                    data-choices 
                    data-choices-groups 
                    data-placeholder="Select Option"
                    defaultValue={isRequired}
                    onChange={(val) => setIsRequired(val)}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </ChoicesFormInput>
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <ChoicesFormInput 
                    className="form-control" 
                    id="status" 
                    data-choices 
                    data-choices-groups 
                    data-placeholder="Select Status"
                    defaultValue={isActive ? 'active' : 'inactive'}
                    onChange={(val) => setIsActive(val === 'active')}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </ChoicesFormInput>
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <TextFormInput control={control} type="text" name="placeholder" label="Placeholder Text" placeholder="Enter Placeholder Text" />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <TextFormInput control={control} type="text" name="defaultValue" label="Default Value" placeholder="Enter Default Value" />
                </div>
              </Col>
              {(fieldType === 'select' || fieldType === 'checkbox') && (
                <Col lg={12}>
                  <div className="mb-3">
                    <TextFormInput control={control} type="text" name="options" label="Options (comma separated)" placeholder="Option 1, Option 2, Option 3" />
                  </div>
                </Col>
              )}
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button type="button" variant="secondary" onClick={toggleModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={editLoading}>
              {editLoading ? <><Spinner size="sm" className="me-2" />Updating...</> : 'Update Custom Field'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>;
};

export default CustomFieldListPage;
