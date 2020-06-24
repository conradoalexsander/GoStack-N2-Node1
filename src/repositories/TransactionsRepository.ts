import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance: Balance = this.transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => ({
        ...accumulator,
        [transaction.type]:
          accumulator[transaction.type] + transaction.value || 0,
        total:
          transaction.type === 'income'
            ? accumulator.total + transaction.value
            : accumulator.total - transaction.value,
      }),
      { income: 0, outcome: 0, total: 0 },
    );

    return balance;
  }

  public create({ title, value, type }: TransactionDTO): Transaction {
    const balance = this.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new Error('Not enough balance for this operation');
    }

    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
