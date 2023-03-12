
import { useEffect, useState, useRef } from 'react'
import IItem from '../model/IItem';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { getItems, postItem } from '../services/items';

const ExpenseTracker = () => {
    const [items, setItems] = useState<IItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [show, setShow] = useState(false);

    const payeeNameRef = useRef<HTMLSelectElement | null>(null);
    const priceRef = useRef<HTMLInputElement | null>(null);
    const productRef = useRef<HTMLInputElement | null>(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const addItem = async () => {
        const item = {
            payeeName: payeeNameRef.current?.value || '',
            product: productRef.current?.value || '',
            setDate: (new Date()).toISOString().substring(0, 10),
            price: parseInt(priceRef.current?.value || '0')

        };
        const newItem = await postItem(item)
        setItems(
            [
                ...items,
                newItem
            ]
        );
        setShow(true)
        handleClose()

    }

    const fetchItems = async () => {
        setLoading(true)
        const items = await getItems();
        setItems(items);
        setLoading(false);
    }

    const personalExpense = (payeeName: string) => {
        return items.filter(i => i.payeeName === payeeName).reduce((acc, i) => acc + i.price, 0)
    }

    const getPayable = () => {
        const rahulPaid = personalExpense('Rahul')
        const rameshPaid = personalExpense('Ramesh')
        return {
            payable: Math.abs(rahulPaid - rameshPaid) / 2,
            message: rahulPaid < rameshPaid ? "Rahul to pay" : "Ramesh to pay"
        }
    }
    useEffect(
        () => {
            fetchItems();
        },
        [] // effect function to run only on component load
    )
    return (
        <Container className='my-4'>
            <h1>  Expense Tracker
                <Button variant='primary float-end' onClick={handleShow}>Add an item </Button>
            </h1>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add an Item </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Who paid</Form.Label>
                            <Form.Select aria-label="Default select example" ref={payeeNameRef}>
                                <option>Open this select menu</option>
                                <option value="Rahul">Rahul</option>
                                <option value="Ramesh">Ramesh</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword" >
                            <Form.Label>Expense</Form.Label>
                            <Form.Control type="number" placeholder="how much was paid" ref={priceRef} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Describe the expense</Form.Label>
                            <Form.Control placeholder="Describe expense" ref={productRef} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}> Close  </Button>
                    <Button variant="primary" onClick={addItem}> Save Changes </Button>
                </Modal.Footer>
            </Modal>
            <br />
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Payee</th>
                        <th>Date </th>
                        <th>Description</th>
                        <th>Price</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        items.map(item =>
                            <tr key={item.id}>
                                <td className={item.payeeName === 'Rahul' ? 'bg-success' : 'bg-info'}> {item.payeeName} </td>
                                <td className={item.payeeName === 'Rahul' ? 'bg-success' : 'bg-info'}> {item.setDate}</td>
                                <td className={item.payeeName === 'Rahul' ? 'bg-success' : 'bg-info'}> {item.product}</td>
                                <td className={item.payeeName === 'Rahul' ? 'bg-success' : 'bg-info'}> {item.price}</td>

                            </tr>
                        )
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3} className='bg-primary'>Total Amount spent by Rahul</td>
                        <td className='bg-primary'>{personalExpense('Rahul')}</td>
                    </tr>
                    <tr>
                        <td colSpan={3} className='bg-secondary'>Total Amount spent by Ramesh</td>
                        <td className='bg-secondary'>{personalExpense('Ramesh')}</td>

                    </tr>
                    <tr>
                        <td colSpan={3} className='bg-danger'> {getPayable().message} </td>
                        <td className='bg-danger'>{getPayable().payable} </td>
                    </tr>
                </tfoot>


            </Table>
        </Container>
    )
}

export default ExpenseTracker