/*
  # Initial Schema Setup for Foreign Trading System

  1. New Tables
    - `profiles`
      - Extended user information and KYC data
    - `trade_orders`
      - Stores all trade orders (buy/sell)
    - `transactions`
      - Records all financial transactions
    - `market_rates`
      - Stores currency exchange rates

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Profiles table for extended user information
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  company_name text,
  kyc_status text DEFAULT 'pending',
  kyc_submitted_at timestamptz,
  kyc_approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Trade orders table
CREATE TABLE IF NOT EXISTS trade_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  order_type text NOT NULL CHECK (order_type IN ('buy', 'sell')),
  base_currency text NOT NULL,
  quote_currency text NOT NULL,
  amount numeric NOT NULL,
  price numeric NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE trade_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON trade_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON trade_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  order_id uuid REFERENCES trade_orders(id),
  transaction_type text NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal', 'trade')),
  amount numeric NOT NULL,
  currency text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  stripe_payment_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Market rates table
CREATE TABLE IF NOT EXISTS market_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency text NOT NULL,
  quote_currency text NOT NULL,
  rate numeric NOT NULL,
  last_updated_at timestamptz DEFAULT now(),
  UNIQUE(base_currency, quote_currency)
);

ALTER TABLE market_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view market rates"
  ON market_rates FOR SELECT
  TO authenticated
  USING (true);