// Invoice Detail Page
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { invoiceService } from "@/lib/services/invoice.service"
import { InvoiceView } from "@/components/billing/invoice-view"

interface InvoicePageProps {
  params: {
    invoiceId: string
  }
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  // Fetch invoice
  const invoice = await invoiceService.getInvoiceById(params.invoiceId)

  if (!invoice) {
    notFound()
  }

  // Verify user owns this invoice
  if (invoice.userId !== session.user.id) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <InvoiceView invoice={invoice} />
    </div>
  )
}
