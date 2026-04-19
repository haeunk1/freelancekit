import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

const defaultSender = () => ({
  name: '',
  email: '',
  address: '',
  phone: '',
})

const defaultRecipient = () => ({
  name: '',
  email: '',
  address: '',
})

const defaultItem = () => ({
  id: Date.now(),
  description: '',
  quantity: 1,
  rate: 0,
})

const defaultInvoiceForm = () => ({
  logo: null,
  signature: null,
  invoiceNumber: 'INV-001',
  date: new Date().toISOString().slice(0, 10),
  dueDate: '',
  currency: 'USD',
  from: defaultSender(),
  to: defaultRecipient(),
  items: [defaultItem()],
  taxRate: 0,
  discountRate: 0,
  notes: '',
})

export const useDocumentStore = defineStore('document', () => {
  const invoiceForm = reactive(defaultInvoiceForm())
  const quoteForm = reactive({ ...defaultInvoiceForm(), invoiceNumber: 'QUO-001' })
  const receiptForm = reactive({ ...defaultInvoiceForm(), invoiceNumber: 'REC-001' })

  function addItem(form) {
    form.items.push(defaultItem())
  }

  function removeItem(form, id) {
    const idx = form.items.findIndex(i => i.id === id)
    if (idx !== -1 && form.items.length > 1) form.items.splice(idx, 1)
  }

  function resetForm(form) {
    const fresh = defaultInvoiceForm()
    Object.assign(form, fresh)
    form.items.splice(0, form.items.length, defaultItem())
  }

  return { invoiceForm, quoteForm, receiptForm, addItem, removeItem, resetForm }
})
