import PageTransition from '~/componets/transitions/PageTransition'
import AdminLayout from '~/layouts/AdminLayout'

const DetailReductionOfGoodPage = () => {
  return (
    <PageTransition>
      <h1>DetailReductionOfGoodPage</h1>
    </PageTransition>
  )
}

DetailReductionOfGoodPage.layout = (page) => <AdminLayout children={page} />
export default DetailReductionOfGoodPage
