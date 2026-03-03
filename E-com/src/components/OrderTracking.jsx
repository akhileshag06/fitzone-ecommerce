import { formatDate } from '../utils/helpers';

function OrderTracking({ order }) {
  const trackingSteps = [
    { status: 'Processing', icon: '📝', label: 'Order Placed' },
    { status: 'Confirmed', icon: '✅', label: 'Confirmed' },
    { status: 'Shipped', icon: '🚚', label: 'Shipped' },
    { status: 'Delivered', icon: '📦', label: 'Delivered' }
  ];

  const statusIndex = trackingSteps.findIndex(step => step.status === order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="order-tracking">
      <div className="tracking-header">
        <h3>Order Tracking</h3>
        <span className="tracking-id">#{order.orderId}</span>
      </div>

      {isCancelled ? (
        <div className="tracking-cancelled">
          <span className="cancelled-icon">❌</span>
          <h4>Order Cancelled</h4>
          <p>This order has been cancelled. Refund has been initiated.</p>
        </div>
      ) : (
        <div className="tracking-timeline">
          {trackingSteps.map((step, index) => (
            <div 
              key={step.status}
              className={`tracking-step ${index <= statusIndex ? 'completed' : ''} ${index === statusIndex ? 'active' : ''}`}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-content">
                <div className="step-label">{step.label}</div>
                {index <= statusIndex && (
                  <div className="step-date">
                    {formatDate(order.updatedAt || order.createdAt)}
                  </div>
                )}
              </div>
              {index < trackingSteps.length - 1 && (
                <div className={`step-line ${index < statusIndex ? 'completed' : ''}`}></div>
              )}
            </div>
          ))}
        </div>
      )}

      {order.status === 'Shipped' && order.trackingNumber && (
        <div className="tracking-info">
          <p><strong>Tracking Number:</strong> {order.trackingNumber}</p>
          <p><strong>Carrier:</strong> {order.carrier || 'FIT ZONE Express'}</p>
          <p><strong>Estimated Delivery:</strong> {order.estimatedDelivery || 'Within 3-5 business days'}</p>
        </div>
      )}

      <style>{`
        .order-tracking {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 25px;
          padding: 30px;
          margin: 20px 0;
        }

        .tracking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .tracking-header h3 {
          color: white;
          font-size: 20px;
        }

        .tracking-id {
          color: #ffb74d;
          font-family: monospace;
          font-weight: 600;
        }

        .tracking-cancelled {
          text-align: center;
          padding: 40px;
        }

        .cancelled-icon {
          font-size: 64px;
          display: block;
          margin-bottom: 20px;
        }

        .tracking-cancelled h4 {
          color: #ff6b6b;
          font-size: 24px;
          margin-bottom: 10px;
        }

        .tracking-cancelled p {
          color: rgba(255, 255, 255, 0.6);
        }

        .tracking-timeline {
          position: relative;
          padding: 20px 0;
        }

        .tracking-step {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          position: relative;
          padding-bottom: 40px;
        }

        .tracking-step:last-child {
          padding-bottom: 0;
        }

        .step-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
        }

        .tracking-step.completed .step-icon {
          background: linear-gradient(135deg, #ffb74d, #ff8a5c);
          border-color: #ffb74d;
          box-shadow: 0 0 20px rgba(255, 183, 77, 0.4);
        }

        .tracking-step.active .step-icon {
          background: linear-gradient(135deg, #4dd0ff, #00b0ff);
          border-color: #4dd0ff;
          box-shadow: 0 0 20px rgba(77, 208, 255, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .step-content {
          flex: 1;
          padding-top: 10px;
        }

        .step-label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .tracking-step.completed .step-label,
        .tracking-step.active .step-label {
          color: white;
        }

        .step-date {
          color: rgba(255, 255, 255, 0.4);
          font-size: 13px;
        }

        .step-line {
          position: absolute;
          left: 24px;
          top: 50px;
          width: 2px;
          height: calc(100% - 10px);
          background: rgba(255, 255, 255, 0.1);
          z-index: 1;
        }

        .step-line.completed {
          background: linear-gradient(to bottom, #ffb74d, #ff8a5c);
        }

        .tracking-info {
          margin-top: 30px;
          padding: 20px;
          background: rgba(77, 208, 255, 0.1);
          border: 1px solid rgba(77, 208, 255, 0.2);
          border-radius: 15px;
        }

        .tracking-info p {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 10px;
          font-size: 14px;
        }

        .tracking-info p:last-child {
          margin-bottom: 0;
        }

        .tracking-info strong {
          color: #4dd0ff;
        }

        @media (max-width: 768px) {
          .order-tracking {
            padding: 20px;
          }

          .step-icon {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }

          .step-line {
            left: 19px;
          }

          .tracking-step {
            gap: 15px;
            padding-bottom: 30px;
          }
        }
      `}</style>
    </div>
  );
}

export default OrderTracking;
