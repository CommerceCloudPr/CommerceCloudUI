import PageTItle from '@/components/PageTItle';
import EditForm from './components/EditForm';
export const metadata = {
  title: 'Custom Field Add'
};
const CustomFieldAddPage = () => {
  return <div>
      <PageTItle title="CUSTOM FIELD ADD" />
      <EditForm />
    </div>;
};
export default CustomFieldAddPage;
