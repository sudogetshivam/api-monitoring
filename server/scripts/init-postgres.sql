CREATE TABLE IF NOT EXISTS endpoint_metrics{
    id SERIAL PRIMARY KEY, 
    client_id VARCHAR(24) NOT NULL, /*ye hame mongodb se milega*/
    service_name VARCHAR(255) NOT NULL,
    endpoint VARCHAR(500) NOT NULL,/* hitted which endpoint like requests are coming on which endpoint*/
    method VARCHAR(10) NOT NULL, /*which method used get,post*/
    --if any requests comes suppose at 10;25 then its timestamp is taken and data/requests is stored inside a bucket whose bucket size is [10:00-11:00]
    -- the aggragted matrix that we will  of whole bucket
    --mhuje 1 ghante ki bucket do ham eska aggregated nikal lenge, esse kya hoga ki ham abde data main cheeze mesaure kar payenge
    time_bucket TIMESTAMPS NOT NULL,
    total_hits INTEGER DEFAULT 0,
    error_hits INTEGER DEFAULT 0, /*client ka aisa api jo user ne use kiya aur usko error mila */
    avg_latency NUMERIC(10,3) DEFAULT 0.000,
    min_latency NUMERIC(10,3) DEFAULT 0.000,
    max_latency NUMERIC(10,3) DEFAULT 0.000,
    created_at TIMESTAMPS DEFAULT CURRENT_TIMESTAMPS,
    updated_at TIMESTAMPS DEFAULT CURRENT_TIMESTAMPS,

    UNIQUE(client_id,service_name, endpoint, method, time_bucket);
}

